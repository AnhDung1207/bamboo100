// Dữ liệu biểu ký quỹ — nguồn: "Danh sách hàng hóa" có hiệu lực từ 02/10/2026.
// Khi MXV cập nhật mức ký quỹ mới, chỉ cần sửa file này.
//   toChuc: Mức ký quỹ ban đầu (VND)  → hiển thị ở cột "Ký quỹ tổ chức"
//   caNhan: Mức ký quỹ giao dịch MXV (VND) → hiển thị ở cột "Ký quỹ cá nhân"

export type KyQuyGroup = "nong-san" | "kim-loai" | "nang-luong" | "nguyen-lieu"

export type KyQuyItem = {
  ma: string
  ten: string
  nhom: KyQuyGroup
  san: string
  toChuc: number
  caNhan: number
}

export const KY_QUY_EFFECTIVE_DATE = "02/10/2026"

export const KY_QUY_GROUP_LABEL: Record<KyQuyGroup, string> = {
  "nong-san": "Nông sản",
  "kim-loai": "Kim loại",
  "nang-luong": "Năng lượng",
  "nguyen-lieu": "Nguyên liệu công nghiệp",
}

export const KY_QUY_DATA: KyQuyItem[] = [
  { ma: "ZWA", ten: "Lúa Mỳ", nhom: "nong-san", san: "CBOT", toChuc: 58449600, caNhan: 70139520 },
  { ma: "ZSE", ten: "Đậu Tương", nhom: "nong-san", san: "CBOT", toChuc: 73353600, caNhan: 88024320 },
  { ma: "ZME", ten: "Khô Đậu Tương", nhom: "nong-san", san: "CBOT", toChuc: 44193600, caNhan: 53032320 },
  { ma: "ZLE", ten: "Dầu Đậu Tương", nhom: "nong-san", san: "CBOT", toChuc: 59875200, caNhan: 71850240 },
  { ma: "ZCE", ten: "Ngô", nhom: "nong-san", san: "CBOT", toChuc: 32425920, caNhan: 38911104 },
  { ma: "XB", ten: "Đậu Tương Mini", nhom: "nong-san", san: "CBOT", toChuc: 14670720, caNhan: 17604864 },
  { ma: "XW", ten: "Lúa Mỳ Mini", nhom: "nong-san", san: "CBOT", toChuc: 11689920, caNhan: 14027904 },
  { ma: "XC", ten: "Ngô Mini", nhom: "nong-san", san: "CBOT", toChuc: 6480000, caNhan: 7776000 },
  { ma: "KWE", ten: "Lúa mỳ Kansas", nhom: "nong-san", san: "CBOT", toChuc: 57024000, caNhan: 68428800 },
  { ma: "ZRE", ten: "Gạo Thô", nhom: "nong-san", san: "CBOT", toChuc: 34214400, caNhan: 41057280 },
  { ma: "SIE", ten: "Bạc", nhom: "kim-loai", san: "COMEX", toChuc: 636186240, caNhan: 763423488 },
  { ma: "MQI", ten: "Bạc mini", nhom: "kim-loai", san: "COMEX", toChuc: 338878080, caNhan: 406653696 },
  { ma: "SIL", ten: "Bạc micro", nhom: "kim-loai", san: "COMEX", toChuc: 134732160, caNhan: 161678592 },
  { ma: "PLE", ten: "Bạch kim", nhom: "kim-loai", san: "NYMEX", toChuc: 185405760, caNhan: 222486912 },
  { ma: "CPE", ten: "Đồng", nhom: "kim-loai", san: "COMEX", toChuc: 342144000, caNhan: 410572800 },
  { ma: "MQC", ten: "Đồng mini", nhom: "kim-loai", san: "COMEX", toChuc: 171072000, caNhan: 205286400 },
  { ma: "MHG", ten: "Đồng micro", nhom: "kim-loai", san: "COMEX", toChuc: 34214400, caNhan: 41057280 },
  { ma: "FEF", ten: "Quặng sắt", nhom: "kim-loai", san: "SGX", toChuc: 26801280, caNhan: 32161536 },
  { ma: "CLE", ten: "Dầu WTI", nhom: "nang-luong", san: "NYMEX", toChuc: 164613540, caNhan: 197536248 },
  { ma: "NQM", ten: "Dầu WTI Mini", nhom: "nang-luong", san: "NYMEX", toChuc: 86106240, caNhan: 103327488 },
  { ma: "MCLE", ten: "Dầu thô WTI micro", nhom: "nang-luong", san: "NYMEX", toChuc: 17210880, caNhan: 20653056 },
  { ma: "QO", ten: "Dầu thô Brent", nhom: "nang-luong", san: "ICE EU", toChuc: 167365440, caNhan: 200838528 },
  { ma: "BM", ten: "Dầu thô brent mini", nhom: "nang-luong", san: "ICE SG", toChuc: 21435840, caNhan: 25723008 },
  { ma: "QP", ten: "Dầu ít lưu huỳnh", nhom: "nang-luong", san: "ICE EU", toChuc: 160056000, caNhan: 192067200 },
  { ma: "RBE", ten: "Xăng RBOB", nhom: "nang-luong", san: "NYMEX", toChuc: 196499520, caNhan: 235799424 },
  { ma: "NGE", ten: "Khí tự nhiên", nhom: "nang-luong", san: "NYMEX", toChuc: 73297560, caNhan: 87957072 },
  { ma: "NQG", ten: "Khí tự nhiên mini", nhom: "nang-luong", san: "NYMEX", toChuc: 19336320, caNhan: 23203584 },
  { ma: "ZFT", ten: "Cao su TSR 20", nhom: "nguyen-lieu", san: "SGX", toChuc: 32788800, caNhan: 39346560 },
  { ma: "CCE", ten: "Ca cao", nhom: "nguyen-lieu", san: "ICE US", toChuc: 241496640, caNhan: 289795968 },
  { ma: "TRU", ten: "Cao su RSS3 TOCOM", nhom: "nguyen-lieu", san: "TOCOM", toChuc: 21202500, caNhan: 25443000 },
  { ma: "CTE", ten: "Bông Sợi", nhom: "nguyen-lieu", san: "ICE US", toChuc: 60730560, caNhan: 72876672 },
  { ma: "KCE", ten: "Cà phê Arabica", nhom: "nguyen-lieu", san: "ICE US", toChuc: 431645760, caNhan: 517974912 },
  { ma: "SBE", ten: "Đường kính 11", nhom: "nguyen-lieu", san: "ICE US", toChuc: 34810560, caNhan: 41772672 },
  { ma: "MPO", ten: "Dầu Cọ", nhom: "nguyen-lieu", san: "BMDX", toChuc: 50080000, caNhan: 60096000 },
  { ma: "QW", ten: "Đường trắng", nhom: "nguyen-lieu", san: "ICE EU", toChuc: 53239680, caNhan: 63887616 },
  { ma: "LRC", ten: "Cà phê Robusta", nhom: "nguyen-lieu", san: "ICE EU", toChuc: 97511040, caNhan: 117013248 },
]
