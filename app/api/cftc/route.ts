import { inflateRawSync } from "node:zlib"
import { createClient } from "@/lib/supabase/server"

export const runtime = "nodejs"

const CFTC_DATASET = "kh3c-gbw2"
const CONTRACT_CODES = [
  "001602", "002602", "005602", "007601", "026603", "033661", "083731",
  "080732", "073732", "057642", "054642", "061641", "067651", "023651",
  "111659", "022651", "088691", "084691", "085692", "076651", "075651",
]
const CONTRACT_CODE_SET = new Set(CONTRACT_CODES)

const SELECT_FIELDS = [
  "report_date_as_yyyy_mm_dd",
  "cftc_contract_market_code",
  "market_and_exchange_names",
  "open_interest_all",
  "m_money_positions_long_all",
  "m_money_positions_short_all",
  "m_money_positions_spread_all",
].join(",")

interface NormalizedRow {
  report_date_as_yyyy_mm_dd: string
  cftc_contract_market_code: string
  market_and_exchange_names: string
  open_interest_all: string
  m_money_positions_long_all: string
  m_money_positions_short_all: string
  m_money_positions_spread_all: string
}

function findEndOfCentralDirectory(buffer: Buffer) {
  const signature = 0x06054b50
  const minimumOffset = Math.max(0, buffer.length - 65_557)
  for (let offset = buffer.length - 22; offset >= minimumOffset; offset -= 1) {
    if (buffer.readUInt32LE(offset) === signature) return offset
  }
  throw new Error("Không tìm thấy ZIP central directory")
}

function extractFirstZipEntry(arrayBuffer: ArrayBuffer) {
  const zip = Buffer.from(arrayBuffer)
  const endOffset = findEndOfCentralDirectory(zip)
  const centralOffset = zip.readUInt32LE(endOffset + 16)

  if (zip.readUInt32LE(centralOffset) !== 0x02014b50) {
    throw new Error("ZIP central directory không hợp lệ")
  }

  const compressionMethod = zip.readUInt16LE(centralOffset + 10)
  const compressedSize = zip.readUInt32LE(centralOffset + 20)
  const localHeaderOffset = zip.readUInt32LE(centralOffset + 42)

  if (zip.readUInt32LE(localHeaderOffset) !== 0x04034b50) {
    throw new Error("ZIP local header không hợp lệ")
  }

  const fileNameLength = zip.readUInt16LE(localHeaderOffset + 26)
  const extraLength = zip.readUInt16LE(localHeaderOffset + 28)
  const dataOffset = localHeaderOffset + 30 + fileNameLength + extraLength
  const compressed = zip.subarray(dataOffset, dataOffset + compressedSize)

  if (compressionMethod === 0) return compressed.toString("utf8")
  if (compressionMethod === 8) return inflateRawSync(compressed).toString("utf8")
  throw new Error(`ZIP compression method ${compressionMethod} chưa được hỗ trợ`)
}

function parseCsvLine(line: string) {
  const values: string[] = []
  let value = ""
  let quoted = false

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index]
    if (character === "\"") {
      if (quoted && line[index + 1] === "\"") {
        value += "\""
        index += 1
      } else {
        quoted = !quoted
      }
    } else if (character === "," && !quoted) {
      values.push(value.trim())
      value = ""
    } else {
      value += character
    }
  }
  values.push(value.trim())
  return values
}

function parseHistoricalText(text: string): NormalizedRow[] {
  const lines = text.split(/\r?\n/).filter(Boolean)
  if (lines.length < 2) return []

  const header = parseCsvLine(lines[0])
  const indexOf = (name: string) => {
    const index = header.indexOf(name)
    if (index < 0) throw new Error(`Thiếu cột ${name} trong dữ liệu CFTC`)
    return index
  }

  const indexes = {
    market: indexOf("Market_and_Exchange_Names"),
    date: indexOf("Report_Date_as_YYYY-MM-DD"),
    code: indexOf("CFTC_Contract_Market_Code"),
    oi: indexOf("Open_Interest_All"),
    long: indexOf("M_Money_Positions_Long_All"),
    short: indexOf("M_Money_Positions_Short_All"),
    spread: indexOf("M_Money_Positions_Spread_All"),
  }

  const rows: NormalizedRow[] = []
  for (let lineIndex = 1; lineIndex < lines.length; lineIndex += 1) {
    const values = parseCsvLine(lines[lineIndex])
    const code = values[indexes.code]?.trim()
    if (!CONTRACT_CODE_SET.has(code)) continue
    rows.push({
      report_date_as_yyyy_mm_dd: values[indexes.date]?.trim(),
      cftc_contract_market_code: code,
      market_and_exchange_names: values[indexes.market]?.trim(),
      open_interest_all: values[indexes.oi]?.trim(),
      m_money_positions_long_all: values[indexes.long]?.trim(),
      m_money_positions_short_all: values[indexes.short]?.trim(),
      m_money_positions_spread_all: values[indexes.spread]?.trim(),
    })
  }
  return rows
}

async function fetchHistoricalYear(year: number) {
  const response = await fetch(
    `https://www.cftc.gov/files/dea/history/com_disagg_txt_${year}.zip`,
    { next: { revalidate: 1800 } },
  )
  if (!response.ok) throw new Error(`CFTC historical ${year}: ${response.status}`)
  return parseHistoricalText(extractFirstZipEntry(await response.arrayBuffer()))
}

async function fetchSocrata() {
  const where = CONTRACT_CODES
    .map((code) => `cftc_contract_market_code='${code}'`)
    .join(" OR ")
  const params = new URLSearchParams({
    "$select": SELECT_FIELDS,
    "$where": where,
    "$order": "report_date_as_yyyy_mm_dd DESC",
    "$limit": "5000",
  })
  const headers: HeadersInit = { Accept: "application/json" }
  if (process.env.CFTC_APP_TOKEN) headers["X-App-Token"] = process.env.CFTC_APP_TOKEN

  const response = await fetch(
    `https://publicreporting.cftc.gov/resource/${CFTC_DATASET}.json?${params}`,
    { headers, next: { revalidate: 1800 } },
  )
  if (!response.ok) throw new Error(`CFTC Socrata: ${response.status}`)
  const rows: unknown = await response.json()
  if (!Array.isArray(rows)) throw new Error("Định dạng Socrata không hợp lệ")
  return rows
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return Response.json({ error: "Vui lòng đăng nhập để xem dữ liệu COT" }, { status: 401 })
  }

  let source = "CFTC Socrata"
  try {
    let rows: unknown[]
    try {
      rows = await fetchSocrata()
    } catch (socrataError) {
      console.warn("Socrata unavailable, using official historical files", socrataError)
      const currentYear = new Date().getUTCFullYear()
      const results = await Promise.allSettled([
        fetchHistoricalYear(currentYear),
        fetchHistoricalYear(currentYear - 1),
      ])
      rows = results.flatMap((result) => result.status === "fulfilled" ? result.value : [])
      if (rows.length === 0) throw new Error("Không tải được cả hai nguồn CFTC")
      source = "CFTC official historical files"
    }

    return Response.json(
      { rows, source, fetchedAt: new Date().toISOString() },
      { headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" } },
    )
  } catch (error) {
    console.error("Unable to fetch CFTC data", error)
    return Response.json({ error: "Không thể kết nối tới nguồn dữ liệu CFTC" }, { status: 502 })
  }
}
