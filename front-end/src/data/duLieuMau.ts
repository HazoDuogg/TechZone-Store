import type { HangChoMoBan, PhieuBaoHanh, SanPham, ThongTinDonHang, ThongTinKhachHang } from '../types'
import { SO_GOC_ANH, THU_MUC_ANH } from '../lib/duongDanAnh'

export const dsDanhMuc = ['CPU', 'Mainboard', 'RAM', 'VGA', 'SSD', 'Nguồn', 'Case', 'Màn hình', 'Chuột']

const TON_KHO_MAU = [14, 3, 22, 0, 9, 31, 4, 18, 2]

const p = (
  slug: string,
  ten: string,
  thuongHieu: string,
  tenDanhMuc: string,
  gia: number,
  giaNiemYet: number,
  thongSo: Record<string, string>,
): Omit<SanPham, 'id' | 'tonKho'> => ({
  ten,
  thuongHieu,
  gia,
  giaNiemYet: giaNiemYet || null,
  thongSo,
  danhMuc: { id: dsDanhMuc.indexOf(tenDanhMuc) + 1, ten: tenDanhMuc },
  anh: Array.from({ length: SO_GOC_ANH }, (_, i) => ({ duongDan: `san-pham/${THU_MUC_ANH[tenDanhMuc]}/${slug}-${i + 1}` })),
})

export const dsSanPham: SanPham[] = [
  p('cpu-5600', 'AMD Ryzen 5 5600', 'AMD', 'CPU', 2890000, 3290000, { Socket: 'AM4', 'Nhân / luồng': '6 / 12', 'Xung nhịp': '3.5 - 4.4 GHz', 'Đồ họa tích hợp': 'Không' }),
  p('cpu-5600g', 'AMD Ryzen 5 5600G', 'AMD', 'CPU', 3190000, 0, { Socket: 'AM4', 'Nhân / luồng': '6 / 12', 'Xung nhịp': '3.9 - 4.4 GHz', 'Đồ họa tích hợp': 'Có' }),
  p('cpu-7600', 'AMD Ryzen 5 7600', 'AMD', 'CPU', 5190000, 5690000, { Socket: 'AM5', 'Nhân / luồng': '6 / 12', 'Xung nhịp': '3.8 - 5.1 GHz', 'Đồ họa tích hợp': 'Có' }),
  p('cpu-7800x3d', 'AMD Ryzen 7 7800X3D', 'AMD', 'CPU', 11490000, 0, { Socket: 'AM5', 'Nhân / luồng': '8 / 16', 'Xung nhịp': '4.2 - 5.0 GHz', 'Đồ họa tích hợp': 'Có' }),
  p('cpu-12100', 'Intel Core i3-12100', 'Intel', 'CPU', 2490000, 0, { Socket: 'LGA1700', 'Nhân / luồng': '4 / 8', 'Xung nhịp': '3.3 - 4.3 GHz', 'Đồ họa tích hợp': 'Có' }),
  p('cpu-13400f', 'Intel Core i5-13400F', 'Intel', 'CPU', 4350000, 4690000, {
    Socket: 'LGA1700',
    'Nhân / luồng': '10 / 16',
    'Xung nhịp': '2.5 - 4.6 GHz',
    'Đồ họa tích hợp': 'Không',
  }),
  p('cpu-14700k', 'Intel Core i7-14700K', 'Intel', 'CPU', 10290000, 0, { Socket: 'LGA1700', 'Nhân / luồng': '20 / 28', 'Xung nhịp': '3.4 - 5.6 GHz', 'Đồ họa tích hợp': 'Có' }),

  p('mb-b550m', 'MSI B550M PRO-VDH WIFI', 'MSI', 'Mainboard', 2190000, 0, { Socket: 'AM4', Chipset: 'B550', 'Loại RAM': 'DDR4', 'Kích thước': 'Micro-ATX' }),
  p('mb-b650m', 'Gigabyte B650M K', 'Gigabyte', 'Mainboard', 3090000, 3390000, { Socket: 'AM5', Chipset: 'B650', 'Loại RAM': 'DDR5', 'Kích thước': 'Micro-ATX' }),
  p('mb-b650a', 'ASUS ROG STRIX B650-A GAMING WIFI', 'ASUS', 'Mainboard', 6490000, 0, { Socket: 'AM5', Chipset: 'B650', 'Loại RAM': 'DDR5', 'Kích thước': 'ATX' }),
  p('mb-h610', 'ASUS PRIME H610M-K D4', 'ASUS', 'Mainboard', 1890000, 0, { Socket: 'LGA1700', Chipset: 'H610', 'Loại RAM': 'DDR4', 'Kích thước': 'Micro-ATX' }),
  p('mb-b760m', 'ASUS PRIME B760M-A D4', 'ASUS', 'Mainboard', 3590000, 0, { Socket: 'LGA1700', Chipset: 'B760', 'Loại RAM': 'DDR4', 'Kích thước': 'Micro-ATX' }),
  p('mb-z790', 'MSI MAG Z790 TOMAHAWK WIFI', 'MSI', 'Mainboard', 7890000, 8290000, { Socket: 'LGA1700', Chipset: 'Z790', 'Loại RAM': 'DDR5', 'Kích thước': 'ATX' }),

  p('ram-d4-16', 'Kingston Fury Beast 16GB (2x8GB) DDR4 3200', 'Kingston', 'RAM', 1090000, 0, { 'Loại RAM': 'DDR4', 'Dung lượng': '16GB', Bus: '3200 MHz', 'CAS Latency': 'CL16' }),
  p('ram-d4-32', 'Corsair Vengeance LPX 32GB (2x16GB) DDR4 3200', 'Corsair', 'RAM', 1890000, 2090000, {
    'Loại RAM': 'DDR4',
    'Dung lượng': '32GB',
    Bus: '3200 MHz',
    'CAS Latency': 'CL16',
  }),
  p('ram-d5-16', 'Kingston Fury Beast 16GB DDR5 5600', 'Kingston', 'RAM', 1590000, 0, { 'Loại RAM': 'DDR5', 'Dung lượng': '16GB', Bus: '5600 MHz', 'CAS Latency': 'CL36' }),
  p('ram-d5-32', 'Corsair Vengeance 32GB (2x16GB) DDR5 5600', 'Corsair', 'RAM', 2790000, 2990000, {
    'Loại RAM': 'DDR5',
    'Dung lượng': '32GB',
    Bus: '5600 MHz',
    'CAS Latency': 'CL36',
  }),
  p('ram-d5-32z', 'G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5 6000', 'G.Skill', 'RAM', 3490000, 0, {
    'Loại RAM': 'DDR5',
    'Dung lượng': '32GB',
    Bus: '6000 MHz',
    'CAS Latency': 'CL30',
  }),

  p('vga-3050', 'ASUS Dual GeForce RTX 3050 6GB', 'ASUS', 'VGA', 4290000, 0, { Chip: 'RTX 3050', VRAM: '6GB GDDR6', 'Công suất': '70W', 'Nguồn đề nghị': '450W' }),
  p('vga-7600', 'Sapphire Pulse Radeon RX 7600 8GB', 'Sapphire', 'VGA', 6490000, 6890000, { Chip: 'RX 7600', VRAM: '8GB GDDR6', 'Công suất': '165W', 'Nguồn đề nghị': '550W' }),
  p('vga-4060', 'MSI GeForce RTX 4060 VENTUS 2X 8GB', 'MSI', 'VGA', 8190000, 8690000, { Chip: 'RTX 4060', VRAM: '8GB GDDR6', 'Công suất': '115W', 'Nguồn đề nghị': '550W' }),
  p('vga-4070s', 'Gigabyte GeForce RTX 4070 SUPER WINDFORCE 12GB', 'Gigabyte', 'VGA', 16490000, 0, {
    Chip: 'RTX 4070 SUPER',
    VRAM: '12GB GDDR6X',
    'Công suất': '220W',
    'Nguồn đề nghị': '650W',
  }),

  p('ssd-sn580', 'WD Blue SN580 500GB NVMe', 'Western Digital', 'SSD', 1190000, 0, { 'Dung lượng': '500GB', Chuẩn: 'PCIe 4.0 x4', 'Đọc / ghi': '4000 / 3600 MB/s' }),
  p('ssd-nv3', 'Kingston NV3 1TB NVMe', 'Kingston', 'SSD', 1890000, 2090000, { 'Dung lượng': '1TB', Chuẩn: 'PCIe 4.0 x4', 'Đọc / ghi': '6000 / 4000 MB/s' }),
  p('ssd-980pro', 'Samsung 980 PRO 1TB NVMe', 'Samsung', 'SSD', 2690000, 0, { 'Dung lượng': '1TB', Chuẩn: 'PCIe 4.0 x4', 'Đọc / ghi': '7000 / 5000 MB/s' }),

  p('psu-mwe550', 'Cooler Master MWE 550W 80 Plus Bronze', 'Cooler Master', 'Nguồn', 1090000, 0, { 'Công suất': '550W', 'Chứng nhận': '80 Plus Bronze' }),
  p('psu-rm750', 'Corsair RM750e 750W 80 Plus Gold', 'Corsair', 'Nguồn', 2590000, 2790000, { 'Công suất': '750W', 'Chứng nhận': '80 Plus Gold' }),
  p('psu-ss850', 'Seasonic Focus GX-850 850W 80 Plus Gold', 'Seasonic', 'Nguồn', 3290000, 0, { 'Công suất': '850W', 'Chứng nhận': '80 Plus Gold' }),

  p('case-xig', 'Xigmatek Gaming X 3 quạt', 'Xigmatek', 'Case', 790000, 0, { 'Hỗ trợ': 'ATX / Micro-ATX', 'Quạt kèm theo': '3 quạt' }),
  p('case-h5', 'NZXT H5 Flow', 'NZXT', 'Case', 1990000, 2190000, { 'Hỗ trợ': 'ATX / Micro-ATX', 'Quạt kèm theo': '2 quạt' }),

  p('mon-lg24', 'LG 24GN600 24" IPS 144Hz', 'LG', 'Màn hình', 3190000, 3590000, { 'Kích thước': '24"', 'Tấm nền': 'IPS', 'Tần số quét': '144Hz', 'Độ phân giải': '1920x1080' }),
  p('mon-dell27', 'Dell S2722DGM 27" VA 165Hz 2K', 'Dell', 'Màn hình', 5990000, 0, {
    'Kích thước': '27"',
    'Tấm nền': 'VA cong',
    'Tần số quét': '165Hz',
    'Độ phân giải': '2560x1440',
  }),

  p('mouse-g102', 'Logitech G102 Lightsync', 'Logitech', 'Chuột', 390000, 450000, { 'Kết nối': 'Có dây', DPI: '8000', 'Số nút': '6' }),
  p('mouse-da3', 'Razer DeathAdder V3', 'Razer', 'Chuột', 1790000, 0, { 'Kết nối': 'Có dây', DPI: '30000', 'Số nút': '6' }),
].map((sp, i) => ({ ...sp, id: i + 1, tonKho: TON_KHO_MAU[i % TON_KHO_MAU.length] }))

export const dsHangChoMoBan: HangChoMoBan[] = [
  { id: 'cho-4070tis', ten: 'ASUS TUF Gaming GeForce RTX 4070 Ti SUPER 16GB', thuongHieu: 'ASUS', danhMuc: 'VGA', soLuongKho: 6 },
  { id: 'cho-14900k', ten: 'Intel Core i9-14900K', thuongHieu: 'Intel', danhMuc: 'CPU', soLuongKho: 4 },
  { id: 'cho-990evo', ten: 'Samsung 990 EVO 1TB NVMe', thuongHieu: 'Samsung', danhMuc: 'SSD', soLuongKho: 12 },
  { id: 'cho-d5-32r', ten: 'Kingston Fury Renegade 32GB (2x16GB) DDR5 6000', thuongHieu: 'Kingston', danhMuc: 'RAM', soLuongKho: 8 },
  { id: 'cho-4000d', ten: 'Corsair 4000D Airflow', thuongHieu: 'Corsair', danhMuc: 'Case', soLuongKho: 5 },
]

export const dsDonHang: ThongTinDonHang[] = [
  {
    code: 'TZ240001',
    customer: 'Nguyễn Minh Khoa',
    phone: '0901234567',
    email: 'khachhang@techzone.vn',
    address: '12 Lê Lợi, Quận 1, TP.HCM',
    items: [
      { id: 3, qty: 1, serials: ['SN-R57600-10211'] },
      { id: 9, qty: 1, serials: ['SN-B650MK-44021'] },
      { id: 17, qty: 1, serials: ['SN-CVD532-90871'] },
    ],
    discount: 0,
    shipping: 0,
    payment: 'COD',
    status: 'Hoàn tất',
    createdAt: '2026-10-02T09:14:00',
  },
  {
    code: 'TZ240002',
    customer: 'Trần Thu Hà',
    phone: '0912345678',
    email: 'ha.tran@mail.com',
    address: '45 Nguyễn Trãi, Thanh Xuân, Hà Nội',
    items: [
      { id: 21, qty: 1, serials: ['SN-RTX4060-77120'] },
      { id: 27, qty: 1, serials: ['SN-RM750E-23318'] },
    ],
    discount: 200000,
    shipping: 0,
    payment: 'COD',
    status: 'Đang giao',
    createdAt: '2026-10-19T14:40:00',
  },
  {
    code: 'TZ240003',
    customer: 'Lê Quốc Bảo',
    phone: '0987654321',
    email: 'bao.le@mail.com',
    address: '7 Hai Bà Trưng, Hải Châu, Đà Nẵng',
    items: [
      { id: 31, qty: 2, serials: [] },
      { id: 33, qty: 2, serials: [] },
    ],
    discount: 0,
    shipping: 30000,
    payment: 'COD',
    status: 'Chờ xác nhận',
    createdAt: '2026-10-24T20:05:00',
  },
  {
    code: 'TZ240004',
    customer: 'Phạm Gia Hân',
    phone: '0933222111',
    email: 'han.pham@mail.com',
    address: '88 Cách Mạng Tháng 8, Quận 3, TP.HCM',
    items: [{ id: 25, qty: 1, serials: [] }],
    discount: 0,
    shipping: 30000,
    payment: 'COD',
    status: 'Chờ xác nhận',
    createdAt: '2026-10-25T08:30:00',
  },
  {
    code: 'TZ240005',
    customer: 'Nguyễn Minh Khoa',
    phone: '0901234567',
    email: 'khachhang@techzone.vn',
    address: '12 Lê Lợi, Quận 1, TP.HCM',
    items: [{ id: 34, qty: 1, serials: ['SN-DA3-88114'] }],
    discount: 0,
    shipping: 30000,
    payment: 'COD',
    status: 'Đã xác nhận',
    createdAt: '2026-10-23T16:20:00',
  },
  {
    code: 'TZ240006',
    customer: 'Võ Thanh Tùng',
    phone: '0977000111',
    email: 'tung.vo@mail.com',
    address: '21 Trần Phú, Nha Trang, Khánh Hòa',
    items: [
      { id: 6, qty: 1, serials: [] },
      { id: 12, qty: 1, serials: [] },
    ],
    discount: 0,
    shipping: 0,
    payment: 'COD',
    status: 'Đã hủy',
    createdAt: '2026-10-11T11:00:00',
  },
]

export const dsKhachHang: ThongTinKhachHang[] = [
  { id: 1, name: 'Nguyễn Minh Khoa', phone: '0901234567', email: 'khachhang@techzone.vn', address: '12 Lê Lợi, Quận 1, TP.HCM', note: 'Khách quen, ưu tiên giao nhanh' },
  { id: 2, name: 'Trần Thu Hà', phone: '0912345678', email: 'ha.tran@mail.com', address: '45 Nguyễn Trãi, Thanh Xuân, Hà Nội', note: '' },
  { id: 3, name: 'Lê Quốc Bảo', phone: '0987654321', email: 'bao.le@mail.com', address: '7 Hai Bà Trưng, Hải Châu, Đà Nẵng', note: 'Mua số lượng cho văn phòng' },
  { id: 4, name: 'Phạm Gia Hân', phone: '0933222111', email: 'han.pham@mail.com', address: '88 Cách Mạng Tháng 8, Quận 3, TP.HCM', note: '' },
  { id: 5, name: 'Võ Thanh Tùng', phone: '0977000111', email: 'tung.vo@mail.com', address: '21 Trần Phú, Nha Trang, Khánh Hòa', note: 'Hay hỏi về bảo hành' },
]

export const dsPhieuBaoHanh: PhieuBaoHanh[] = [
  { id: 'BH0012', serial: 'SN-LG24-55091', customer: 'Lê Quốc Bảo', issue: 'Màn hình có sọc dọc bên phải', status: 'Đang kiểm tra', result: '', createdAt: '2026-10-22' },
  {
    id: 'BH0011',
    serial: 'SN-DA3-88002',
    customer: 'Nguyễn Minh Khoa',
    issue: 'Nút chuột trái bị đúp',
    status: 'Chờ linh kiện',
    result: 'Đã đặt switch thay thế',
    createdAt: '2026-10-18',
  },
  {
    id: 'BH0010',
    serial: 'SN-SSD980-30415',
    customer: 'Phạm Gia Hân',
    issue: 'Ổ cứng báo lỗi khi cài Windows',
    status: 'Từ chối',
    result: 'Hết hạn bảo hành từ 03/2026',
    createdAt: '2026-10-15',
  },
  {
    id: 'BH0009',
    serial: 'SN-RTX4060-77120',
    customer: 'Trần Thu Hà',
    issue: 'Quạt kêu to khi tải nặng',
    status: 'Hoàn tất',
    result: 'Đã thay quạt, test ổn định 2 giờ',
    createdAt: '2026-10-09',
  },
]

export const doanhThu12Thang = [
  ['11/25', 412],
  ['12/25', 598],
  ['01/26', 701],
  ['02/26', 455],
  ['03/26', 520],
  ['04/26', 489],
  ['05/26', 560],
  ['06/26', 612],
  ['07/26', 648],
  ['08/26', 720],
  ['09/26', 786],
  ['10/26', 664],
] as [string, number][]

export const gioHangMau = [
  { id: 21, qty: 1 },
  { id: 17, qty: 2 },
  { id: 25, qty: 1 },
]

export const cauHinhMau = [2, 8, 14, 20, 23, 26, 29]
