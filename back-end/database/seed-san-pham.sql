USE techzone;

INSERT INTO san_pham (id_danh_muc, ten, thuong_hieu, gia, gia_niem_yet, thong_so, so_thang_bao_hanh, trang_thai) VALUES
  ((SELECT id FROM danh_muc WHERE ten = 'CPU'), 'AMD Ryzen 5 5600', 'AMD', 2890000, 3290000, '{"Socket":"AM4","Nhân / luồng":"6 / 12","Xung nhịp":"3.5 - 4.4 GHz","Đồ họa tích hợp":"Không"}', 36, 'dang_ban'),
  ((SELECT id FROM danh_muc WHERE ten = 'CPU'), 'AMD Ryzen 5 5600G', 'AMD', 3190000, NULL, '{"Socket":"AM4","Nhân / luồng":"6 / 12","Xung nhịp":"3.9 - 4.4 GHz","Đồ họa tích hợp":"Có"}', 36, 'dang_ban'),
  ((SELECT id FROM danh_muc WHERE ten = 'CPU'), 'AMD Ryzen 5 7600', 'AMD', 5190000, 5690000, '{"Socket":"AM5","Nhân / luồng":"6 / 12","Xung nhịp":"3.8 - 5.1 GHz","Đồ họa tích hợp":"Có"}', 36, 'dang_ban'),
  ((SELECT id FROM danh_muc WHERE ten = 'CPU'), 'AMD Ryzen 7 7800X3D', 'AMD', 11490000, NULL, '{"Socket":"AM5","Nhân / luồng":"8 / 16","Xung nhịp":"4.2 - 5.0 GHz","Đồ họa tích hợp":"Có"}', 36, 'dang_ban'),
  ((SELECT id FROM danh_muc WHERE ten = 'CPU'), 'Intel Core i3-12100', 'Intel', 2490000, NULL, '{"Socket":"LGA1700","Nhân / luồng":"4 / 8","Xung nhịp":"3.3 - 4.3 GHz","Đồ họa tích hợp":"Có"}', 36, 'dang_ban'),
  ((SELECT id FROM danh_muc WHERE ten = 'CPU'), 'Intel Core i5-13400F', 'Intel', 4350000, 4690000, '{"Socket":"LGA1700","Nhân / luồng":"10 / 16","Xung nhịp":"2.5 - 4.6 GHz","Đồ họa tích hợp":"Không"}', 36, 'dang_ban'),
  ((SELECT id FROM danh_muc WHERE ten = 'CPU'), 'Intel Core i7-14700K', 'Intel', 10290000, NULL, '{"Socket":"LGA1700","Nhân / luồng":"20 / 28","Xung nhịp":"3.4 - 5.6 GHz","Đồ họa tích hợp":"Có"}', 36, 'dang_ban'),
  ((SELECT id FROM danh_muc WHERE ten = 'Mainboard'), 'MSI B550M PRO-VDH WIFI', 'MSI', 2190000, NULL, '{"Socket":"AM4","Chipset":"B550","Loại RAM":"DDR4","Kích thước":"Micro-ATX"}', 36, 'dang_ban'),
  ((SELECT id FROM danh_muc WHERE ten = 'Mainboard'), 'Gigabyte B650M K', 'Gigabyte', 3090000, 3390000, '{"Socket":"AM5","Chipset":"B650","Loại RAM":"DDR5","Kích thước":"Micro-ATX"}', 36, 'dang_ban'),
  ((SELECT id FROM danh_muc WHERE ten = 'Mainboard'), 'ASUS ROG STRIX B650-A GAMING WIFI', 'ASUS', 6490000, NULL, '{"Socket":"AM5","Chipset":"B650","Loại RAM":"DDR5","Kích thước":"ATX"}', 36, 'dang_ban'),
  ((SELECT id FROM danh_muc WHERE ten = 'Mainboard'), 'ASUS PRIME H610M-K D4', 'ASUS', 1890000, NULL, '{"Socket":"LGA1700","Chipset":"H610","Loại RAM":"DDR4","Kích thước":"Micro-ATX"}', 36, 'dang_ban'),
  ((SELECT id FROM danh_muc WHERE ten = 'Mainboard'), 'ASUS PRIME B760M-A D4', 'ASUS', 3590000, NULL, '{"Socket":"LGA1700","Chipset":"B760","Loại RAM":"DDR4","Kích thước":"Micro-ATX"}', 36, 'dang_ban'),
  ((SELECT id FROM danh_muc WHERE ten = 'Mainboard'), 'MSI MAG Z790 TOMAHAWK WIFI', 'MSI', 7890000, 8290000, '{"Socket":"LGA1700","Chipset":"Z790","Loại RAM":"DDR5","Kích thước":"ATX"}', 36, 'dang_ban'),
  ((SELECT id FROM danh_muc WHERE ten = 'RAM'), 'Kingston Fury Beast 16GB (2x8GB) DDR4 3200', 'Kingston', 1090000, NULL, '{"Loại RAM":"DDR4","Dung lượng":"16GB","Bus":"3200 MHz","CAS Latency":"CL16"}', 36, 'dang_ban'),
  ((SELECT id FROM danh_muc WHERE ten = 'RAM'), 'Corsair Vengeance LPX 32GB (2x16GB) DDR4 3200', 'Corsair', 1890000, 2090000, '{"Loại RAM":"DDR4","Dung lượng":"32GB","Bus":"3200 MHz","CAS Latency":"CL16"}', 36, 'dang_ban'),
  ((SELECT id FROM danh_muc WHERE ten = 'RAM'), 'Kingston Fury Beast 16GB DDR5 5600', 'Kingston', 1590000, NULL, '{"Loại RAM":"DDR5","Dung lượng":"16GB","Bus":"5600 MHz","CAS Latency":"CL36"}', 36, 'dang_ban'),
  ((SELECT id FROM danh_muc WHERE ten = 'RAM'), 'Corsair Vengeance 32GB (2x16GB) DDR5 5600', 'Corsair', 2790000, 2990000, '{"Loại RAM":"DDR5","Dung lượng":"32GB","Bus":"5600 MHz","CAS Latency":"CL36"}', 36, 'dang_ban'),
  ((SELECT id FROM danh_muc WHERE ten = 'RAM'), 'G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5 6000', 'G.Skill', 3490000, NULL, '{"Loại RAM":"DDR5","Dung lượng":"32GB","Bus":"6000 MHz","CAS Latency":"CL30"}', 36, 'dang_ban'),
  ((SELECT id FROM danh_muc WHERE ten = 'VGA'), 'ASUS Dual GeForce RTX 3050 6GB', 'ASUS', 4290000, NULL, '{"Chip":"RTX 3050","VRAM":"6GB GDDR6","Công suất":"70W","Nguồn đề nghị":"450W"}', 36, 'dang_ban'),
  ((SELECT id FROM danh_muc WHERE ten = 'VGA'), 'Sapphire Pulse Radeon RX 7600 8GB', 'Sapphire', 6490000, 6890000, '{"Chip":"RX 7600","VRAM":"8GB GDDR6","Công suất":"165W","Nguồn đề nghị":"550W"}', 36, 'dang_ban'),
  ((SELECT id FROM danh_muc WHERE ten = 'VGA'), 'MSI GeForce RTX 4060 VENTUS 2X 8GB', 'MSI', 8190000, 8690000, '{"Chip":"RTX 4060","VRAM":"8GB GDDR6","Công suất":"115W","Nguồn đề nghị":"550W"}', 36, 'dang_ban'),
  ((SELECT id FROM danh_muc WHERE ten = 'VGA'), 'Gigabyte GeForce RTX 4070 SUPER WINDFORCE 12GB', 'Gigabyte', 16490000, NULL, '{"Chip":"RTX 4070 SUPER","VRAM":"12GB GDDR6X","Công suất":"220W","Nguồn đề nghị":"650W"}', 36, 'dang_ban'),
  ((SELECT id FROM danh_muc WHERE ten = 'SSD'), 'WD Blue SN580 500GB NVMe', 'Western Digital', 1190000, NULL, '{"Dung lượng":"500GB","Chuẩn":"PCIe 4.0 x4","Đọc / ghi":"4000 / 3600 MB/s"}', 36, 'dang_ban'),
  ((SELECT id FROM danh_muc WHERE ten = 'SSD'), 'Kingston NV3 1TB NVMe', 'Kingston', 1890000, 2090000, '{"Dung lượng":"1TB","Chuẩn":"PCIe 4.0 x4","Đọc / ghi":"6000 / 4000 MB/s"}', 36, 'dang_ban'),
  ((SELECT id FROM danh_muc WHERE ten = 'SSD'), 'Samsung 980 PRO 1TB NVMe', 'Samsung', 2690000, NULL, '{"Dung lượng":"1TB","Chuẩn":"PCIe 4.0 x4","Đọc / ghi":"7000 / 5000 MB/s"}', 36, 'dang_ban'),
  ((SELECT id FROM danh_muc WHERE ten = 'Nguồn'), 'Cooler Master MWE 550W 80 Plus Bronze', 'Cooler Master', 1090000, NULL, '{"Công suất":"550W","Chứng nhận":"80 Plus Bronze"}', 36, 'dang_ban'),
  ((SELECT id FROM danh_muc WHERE ten = 'Nguồn'), 'Corsair RM750e 750W 80 Plus Gold', 'Corsair', 2590000, 2790000, '{"Công suất":"750W","Chứng nhận":"80 Plus Gold"}', 36, 'dang_ban'),
  ((SELECT id FROM danh_muc WHERE ten = 'Nguồn'), 'Seasonic Focus GX-850 850W 80 Plus Gold', 'Seasonic', 3290000, NULL, '{"Công suất":"850W","Chứng nhận":"80 Plus Gold"}', 36, 'dang_ban'),
  ((SELECT id FROM danh_muc WHERE ten = 'Case'), 'Xigmatek Gaming X 3 quạt', 'Xigmatek', 790000, NULL, '{"Hỗ trợ":"ATX / Micro-ATX","Quạt kèm theo":"3 quạt"}', 36, 'dang_ban'),
  ((SELECT id FROM danh_muc WHERE ten = 'Case'), 'NZXT H5 Flow', 'NZXT', 1990000, 2190000, '{"Hỗ trợ":"ATX / Micro-ATX","Quạt kèm theo":"2 quạt"}', 36, 'dang_ban'),
  ((SELECT id FROM danh_muc WHERE ten = 'Màn hình'), 'LG 24GN600 24" IPS 144Hz', 'LG', 3190000, 3590000, '{"Kích thước":"24\\"","Tấm nền":"IPS","Tần số quét":"144Hz","Độ phân giải":"1920x1080"}', 36, 'dang_ban'),
  ((SELECT id FROM danh_muc WHERE ten = 'Màn hình'), 'Dell S2722DGM 27" VA 165Hz 2K', 'Dell', 5990000, NULL, '{"Kích thước":"27\\"","Tấm nền":"VA cong","Tần số quét":"165Hz","Độ phân giải":"2560x1440"}', 36, 'dang_ban'),
  ((SELECT id FROM danh_muc WHERE ten = 'Chuột'), 'Logitech G102 Lightsync', 'Logitech', 390000, 450000, '{"Kết nối":"Có dây","DPI":"8000","Số nút":"6"}', 36, 'dang_ban'),
  ((SELECT id FROM danh_muc WHERE ten = 'Chuột'), 'Razer DeathAdder V3', 'Razer', 1790000, NULL, '{"Kết nối":"Có dây","DPI":"30000","Số nút":"6"}', 36, 'dang_ban');

-- AMD Ryzen 5 5600
SET @sp = (SELECT id FROM san_pham WHERE ten = 'AMD Ryzen 5 5600');
INSERT INTO anh_san_pham (id_san_pham, duong_dan, anh_chinh, thu_tu) VALUES
  (@sp, 'san-pham/cpu/cpu-5600-1', 1, 1),
  (@sp, 'san-pham/cpu/cpu-5600-2', 0, 2),
  (@sp, 'san-pham/cpu/cpu-5600-3', 0, 3),
  (@sp, 'san-pham/cpu/cpu-5600-4', 0, 4);
INSERT INTO chi_tiet_san_pham (id_san_pham, so_serial, trang_thai) VALUES
  (@sp, 'SN-CPU5600-0001', 'trong_kho'),
  (@sp, 'SN-CPU5600-0002', 'trong_kho'),
  (@sp, 'SN-CPU5600-0003', 'trong_kho'),
  (@sp, 'SN-CPU5600-0004', 'trong_kho'),
  (@sp, 'SN-CPU5600-0005', 'trong_kho'),
  (@sp, 'SN-CPU5600-0006', 'trong_kho'),
  (@sp, 'SN-CPU5600-0007', 'trong_kho'),
  (@sp, 'SN-CPU5600-0008', 'trong_kho'),
  (@sp, 'SN-CPU5600-0009', 'trong_kho'),
  (@sp, 'SN-CPU5600-0010', 'trong_kho'),
  (@sp, 'SN-CPU5600-0011', 'trong_kho'),
  (@sp, 'SN-CPU5600-0012', 'trong_kho'),
  (@sp, 'SN-CPU5600-0013', 'trong_kho'),
  (@sp, 'SN-CPU5600-0014', 'trong_kho');

-- AMD Ryzen 5 5600G
SET @sp = (SELECT id FROM san_pham WHERE ten = 'AMD Ryzen 5 5600G');
INSERT INTO anh_san_pham (id_san_pham, duong_dan, anh_chinh, thu_tu) VALUES
  (@sp, 'san-pham/cpu/cpu-5600g-1', 1, 1),
  (@sp, 'san-pham/cpu/cpu-5600g-2', 0, 2),
  (@sp, 'san-pham/cpu/cpu-5600g-3', 0, 3),
  (@sp, 'san-pham/cpu/cpu-5600g-4', 0, 4);
INSERT INTO chi_tiet_san_pham (id_san_pham, so_serial, trang_thai) VALUES
  (@sp, 'SN-CPU5600G-0001', 'trong_kho'),
  (@sp, 'SN-CPU5600G-0002', 'trong_kho'),
  (@sp, 'SN-CPU5600G-0003', 'trong_kho');

-- AMD Ryzen 5 7600
SET @sp = (SELECT id FROM san_pham WHERE ten = 'AMD Ryzen 5 7600');
INSERT INTO anh_san_pham (id_san_pham, duong_dan, anh_chinh, thu_tu) VALUES
  (@sp, 'san-pham/cpu/cpu-7600-1', 1, 1),
  (@sp, 'san-pham/cpu/cpu-7600-2', 0, 2),
  (@sp, 'san-pham/cpu/cpu-7600-3', 0, 3),
  (@sp, 'san-pham/cpu/cpu-7600-4', 0, 4);
INSERT INTO chi_tiet_san_pham (id_san_pham, so_serial, trang_thai) VALUES
  (@sp, 'SN-CPU7600-0001', 'trong_kho'),
  (@sp, 'SN-CPU7600-0002', 'trong_kho'),
  (@sp, 'SN-CPU7600-0003', 'trong_kho'),
  (@sp, 'SN-CPU7600-0004', 'trong_kho'),
  (@sp, 'SN-CPU7600-0005', 'trong_kho'),
  (@sp, 'SN-CPU7600-0006', 'trong_kho'),
  (@sp, 'SN-CPU7600-0007', 'trong_kho'),
  (@sp, 'SN-CPU7600-0008', 'trong_kho'),
  (@sp, 'SN-CPU7600-0009', 'trong_kho'),
  (@sp, 'SN-CPU7600-0010', 'trong_kho'),
  (@sp, 'SN-CPU7600-0011', 'trong_kho'),
  (@sp, 'SN-CPU7600-0012', 'trong_kho'),
  (@sp, 'SN-CPU7600-0013', 'trong_kho'),
  (@sp, 'SN-CPU7600-0014', 'trong_kho'),
  (@sp, 'SN-CPU7600-0015', 'trong_kho'),
  (@sp, 'SN-CPU7600-0016', 'trong_kho'),
  (@sp, 'SN-CPU7600-0017', 'trong_kho'),
  (@sp, 'SN-CPU7600-0018', 'trong_kho'),
  (@sp, 'SN-CPU7600-0019', 'trong_kho'),
  (@sp, 'SN-CPU7600-0020', 'trong_kho'),
  (@sp, 'SN-CPU7600-0021', 'trong_kho'),
  (@sp, 'SN-CPU7600-0022', 'trong_kho');

-- AMD Ryzen 7 7800X3D
SET @sp = (SELECT id FROM san_pham WHERE ten = 'AMD Ryzen 7 7800X3D');
INSERT INTO anh_san_pham (id_san_pham, duong_dan, anh_chinh, thu_tu) VALUES
  (@sp, 'san-pham/cpu/cpu-7800x3d-1', 1, 1),
  (@sp, 'san-pham/cpu/cpu-7800x3d-2', 0, 2),
  (@sp, 'san-pham/cpu/cpu-7800x3d-3', 0, 3),
  (@sp, 'san-pham/cpu/cpu-7800x3d-4', 0, 4);

-- Intel Core i3-12100
SET @sp = (SELECT id FROM san_pham WHERE ten = 'Intel Core i3-12100');
INSERT INTO anh_san_pham (id_san_pham, duong_dan, anh_chinh, thu_tu) VALUES
  (@sp, 'san-pham/cpu/cpu-12100-1', 1, 1),
  (@sp, 'san-pham/cpu/cpu-12100-2', 0, 2),
  (@sp, 'san-pham/cpu/cpu-12100-3', 0, 3),
  (@sp, 'san-pham/cpu/cpu-12100-4', 0, 4);
INSERT INTO chi_tiet_san_pham (id_san_pham, so_serial, trang_thai) VALUES
  (@sp, 'SN-CPU12100-0001', 'trong_kho'),
  (@sp, 'SN-CPU12100-0002', 'trong_kho'),
  (@sp, 'SN-CPU12100-0003', 'trong_kho'),
  (@sp, 'SN-CPU12100-0004', 'trong_kho'),
  (@sp, 'SN-CPU12100-0005', 'trong_kho'),
  (@sp, 'SN-CPU12100-0006', 'trong_kho'),
  (@sp, 'SN-CPU12100-0007', 'trong_kho'),
  (@sp, 'SN-CPU12100-0008', 'trong_kho'),
  (@sp, 'SN-CPU12100-0009', 'trong_kho');

-- Intel Core i5-13400F
SET @sp = (SELECT id FROM san_pham WHERE ten = 'Intel Core i5-13400F');
INSERT INTO anh_san_pham (id_san_pham, duong_dan, anh_chinh, thu_tu) VALUES
  (@sp, 'san-pham/cpu/cpu-13400f-1', 1, 1),
  (@sp, 'san-pham/cpu/cpu-13400f-2', 0, 2),
  (@sp, 'san-pham/cpu/cpu-13400f-3', 0, 3),
  (@sp, 'san-pham/cpu/cpu-13400f-4', 0, 4);
INSERT INTO chi_tiet_san_pham (id_san_pham, so_serial, trang_thai) VALUES
  (@sp, 'SN-CPU13400F-0001', 'trong_kho'),
  (@sp, 'SN-CPU13400F-0002', 'trong_kho'),
  (@sp, 'SN-CPU13400F-0003', 'trong_kho'),
  (@sp, 'SN-CPU13400F-0004', 'trong_kho'),
  (@sp, 'SN-CPU13400F-0005', 'trong_kho'),
  (@sp, 'SN-CPU13400F-0006', 'trong_kho'),
  (@sp, 'SN-CPU13400F-0007', 'trong_kho'),
  (@sp, 'SN-CPU13400F-0008', 'trong_kho'),
  (@sp, 'SN-CPU13400F-0009', 'trong_kho'),
  (@sp, 'SN-CPU13400F-0010', 'trong_kho'),
  (@sp, 'SN-CPU13400F-0011', 'trong_kho'),
  (@sp, 'SN-CPU13400F-0012', 'trong_kho'),
  (@sp, 'SN-CPU13400F-0013', 'trong_kho'),
  (@sp, 'SN-CPU13400F-0014', 'trong_kho'),
  (@sp, 'SN-CPU13400F-0015', 'trong_kho'),
  (@sp, 'SN-CPU13400F-0016', 'trong_kho'),
  (@sp, 'SN-CPU13400F-0017', 'trong_kho'),
  (@sp, 'SN-CPU13400F-0018', 'trong_kho'),
  (@sp, 'SN-CPU13400F-0019', 'trong_kho'),
  (@sp, 'SN-CPU13400F-0020', 'trong_kho'),
  (@sp, 'SN-CPU13400F-0021', 'trong_kho'),
  (@sp, 'SN-CPU13400F-0022', 'trong_kho'),
  (@sp, 'SN-CPU13400F-0023', 'trong_kho'),
  (@sp, 'SN-CPU13400F-0024', 'trong_kho'),
  (@sp, 'SN-CPU13400F-0025', 'trong_kho'),
  (@sp, 'SN-CPU13400F-0026', 'trong_kho'),
  (@sp, 'SN-CPU13400F-0027', 'trong_kho'),
  (@sp, 'SN-CPU13400F-0028', 'trong_kho'),
  (@sp, 'SN-CPU13400F-0029', 'trong_kho'),
  (@sp, 'SN-CPU13400F-0030', 'trong_kho'),
  (@sp, 'SN-CPU13400F-0031', 'trong_kho');

-- Intel Core i7-14700K
SET @sp = (SELECT id FROM san_pham WHERE ten = 'Intel Core i7-14700K');
INSERT INTO anh_san_pham (id_san_pham, duong_dan, anh_chinh, thu_tu) VALUES
  (@sp, 'san-pham/cpu/cpu-14700k-1', 1, 1),
  (@sp, 'san-pham/cpu/cpu-14700k-2', 0, 2),
  (@sp, 'san-pham/cpu/cpu-14700k-3', 0, 3),
  (@sp, 'san-pham/cpu/cpu-14700k-4', 0, 4);
INSERT INTO chi_tiet_san_pham (id_san_pham, so_serial, trang_thai) VALUES
  (@sp, 'SN-CPU14700K-0001', 'trong_kho'),
  (@sp, 'SN-CPU14700K-0002', 'trong_kho'),
  (@sp, 'SN-CPU14700K-0003', 'trong_kho'),
  (@sp, 'SN-CPU14700K-0004', 'trong_kho');

-- MSI B550M PRO-VDH WIFI
SET @sp = (SELECT id FROM san_pham WHERE ten = 'MSI B550M PRO-VDH WIFI');
INSERT INTO anh_san_pham (id_san_pham, duong_dan, anh_chinh, thu_tu) VALUES
  (@sp, 'san-pham/mainboard/mb-b550m-1', 1, 1),
  (@sp, 'san-pham/mainboard/mb-b550m-2', 0, 2),
  (@sp, 'san-pham/mainboard/mb-b550m-3', 0, 3),
  (@sp, 'san-pham/mainboard/mb-b550m-4', 0, 4);
INSERT INTO chi_tiet_san_pham (id_san_pham, so_serial, trang_thai) VALUES
  (@sp, 'SN-MBB550M-0001', 'trong_kho'),
  (@sp, 'SN-MBB550M-0002', 'trong_kho'),
  (@sp, 'SN-MBB550M-0003', 'trong_kho'),
  (@sp, 'SN-MBB550M-0004', 'trong_kho'),
  (@sp, 'SN-MBB550M-0005', 'trong_kho'),
  (@sp, 'SN-MBB550M-0006', 'trong_kho'),
  (@sp, 'SN-MBB550M-0007', 'trong_kho'),
  (@sp, 'SN-MBB550M-0008', 'trong_kho'),
  (@sp, 'SN-MBB550M-0009', 'trong_kho'),
  (@sp, 'SN-MBB550M-0010', 'trong_kho'),
  (@sp, 'SN-MBB550M-0011', 'trong_kho'),
  (@sp, 'SN-MBB550M-0012', 'trong_kho'),
  (@sp, 'SN-MBB550M-0013', 'trong_kho'),
  (@sp, 'SN-MBB550M-0014', 'trong_kho'),
  (@sp, 'SN-MBB550M-0015', 'trong_kho'),
  (@sp, 'SN-MBB550M-0016', 'trong_kho'),
  (@sp, 'SN-MBB550M-0017', 'trong_kho'),
  (@sp, 'SN-MBB550M-0018', 'trong_kho');

-- Gigabyte B650M K
SET @sp = (SELECT id FROM san_pham WHERE ten = 'Gigabyte B650M K');
INSERT INTO anh_san_pham (id_san_pham, duong_dan, anh_chinh, thu_tu) VALUES
  (@sp, 'san-pham/mainboard/mb-b650m-1', 1, 1),
  (@sp, 'san-pham/mainboard/mb-b650m-2', 0, 2),
  (@sp, 'san-pham/mainboard/mb-b650m-3', 0, 3),
  (@sp, 'san-pham/mainboard/mb-b650m-4', 0, 4);
INSERT INTO chi_tiet_san_pham (id_san_pham, so_serial, trang_thai) VALUES
  (@sp, 'SN-MBB650M-0001', 'trong_kho'),
  (@sp, 'SN-MBB650M-0002', 'trong_kho');

-- ASUS ROG STRIX B650-A GAMING WIFI
SET @sp = (SELECT id FROM san_pham WHERE ten = 'ASUS ROG STRIX B650-A GAMING WIFI');
INSERT INTO anh_san_pham (id_san_pham, duong_dan, anh_chinh, thu_tu) VALUES
  (@sp, 'san-pham/mainboard/mb-b650a-1', 1, 1),
  (@sp, 'san-pham/mainboard/mb-b650a-2', 0, 2),
  (@sp, 'san-pham/mainboard/mb-b650a-3', 0, 3),
  (@sp, 'san-pham/mainboard/mb-b650a-4', 0, 4);
INSERT INTO chi_tiet_san_pham (id_san_pham, so_serial, trang_thai) VALUES
  (@sp, 'SN-MBB650A-0001', 'trong_kho'),
  (@sp, 'SN-MBB650A-0002', 'trong_kho'),
  (@sp, 'SN-MBB650A-0003', 'trong_kho'),
  (@sp, 'SN-MBB650A-0004', 'trong_kho'),
  (@sp, 'SN-MBB650A-0005', 'trong_kho'),
  (@sp, 'SN-MBB650A-0006', 'trong_kho'),
  (@sp, 'SN-MBB650A-0007', 'trong_kho'),
  (@sp, 'SN-MBB650A-0008', 'trong_kho'),
  (@sp, 'SN-MBB650A-0009', 'trong_kho'),
  (@sp, 'SN-MBB650A-0010', 'trong_kho'),
  (@sp, 'SN-MBB650A-0011', 'trong_kho'),
  (@sp, 'SN-MBB650A-0012', 'trong_kho'),
  (@sp, 'SN-MBB650A-0013', 'trong_kho'),
  (@sp, 'SN-MBB650A-0014', 'trong_kho');

-- ASUS PRIME H610M-K D4
SET @sp = (SELECT id FROM san_pham WHERE ten = 'ASUS PRIME H610M-K D4');
INSERT INTO anh_san_pham (id_san_pham, duong_dan, anh_chinh, thu_tu) VALUES
  (@sp, 'san-pham/mainboard/mb-h610-1', 1, 1),
  (@sp, 'san-pham/mainboard/mb-h610-2', 0, 2),
  (@sp, 'san-pham/mainboard/mb-h610-3', 0, 3),
  (@sp, 'san-pham/mainboard/mb-h610-4', 0, 4);
INSERT INTO chi_tiet_san_pham (id_san_pham, so_serial, trang_thai) VALUES
  (@sp, 'SN-MBH610-0001', 'trong_kho'),
  (@sp, 'SN-MBH610-0002', 'trong_kho'),
  (@sp, 'SN-MBH610-0003', 'trong_kho');

-- ASUS PRIME B760M-A D4
SET @sp = (SELECT id FROM san_pham WHERE ten = 'ASUS PRIME B760M-A D4');
INSERT INTO anh_san_pham (id_san_pham, duong_dan, anh_chinh, thu_tu) VALUES
  (@sp, 'san-pham/mainboard/mb-b760m-1', 1, 1),
  (@sp, 'san-pham/mainboard/mb-b760m-2', 0, 2),
  (@sp, 'san-pham/mainboard/mb-b760m-3', 0, 3),
  (@sp, 'san-pham/mainboard/mb-b760m-4', 0, 4);
INSERT INTO chi_tiet_san_pham (id_san_pham, so_serial, trang_thai) VALUES
  (@sp, 'SN-MBB760M-0001', 'trong_kho'),
  (@sp, 'SN-MBB760M-0002', 'trong_kho'),
  (@sp, 'SN-MBB760M-0003', 'trong_kho'),
  (@sp, 'SN-MBB760M-0004', 'trong_kho'),
  (@sp, 'SN-MBB760M-0005', 'trong_kho'),
  (@sp, 'SN-MBB760M-0006', 'trong_kho'),
  (@sp, 'SN-MBB760M-0007', 'trong_kho'),
  (@sp, 'SN-MBB760M-0008', 'trong_kho'),
  (@sp, 'SN-MBB760M-0009', 'trong_kho'),
  (@sp, 'SN-MBB760M-0010', 'trong_kho'),
  (@sp, 'SN-MBB760M-0011', 'trong_kho'),
  (@sp, 'SN-MBB760M-0012', 'trong_kho'),
  (@sp, 'SN-MBB760M-0013', 'trong_kho'),
  (@sp, 'SN-MBB760M-0014', 'trong_kho'),
  (@sp, 'SN-MBB760M-0015', 'trong_kho'),
  (@sp, 'SN-MBB760M-0016', 'trong_kho'),
  (@sp, 'SN-MBB760M-0017', 'trong_kho'),
  (@sp, 'SN-MBB760M-0018', 'trong_kho'),
  (@sp, 'SN-MBB760M-0019', 'trong_kho'),
  (@sp, 'SN-MBB760M-0020', 'trong_kho'),
  (@sp, 'SN-MBB760M-0021', 'trong_kho'),
  (@sp, 'SN-MBB760M-0022', 'trong_kho');

-- MSI MAG Z790 TOMAHAWK WIFI
SET @sp = (SELECT id FROM san_pham WHERE ten = 'MSI MAG Z790 TOMAHAWK WIFI');
INSERT INTO anh_san_pham (id_san_pham, duong_dan, anh_chinh, thu_tu) VALUES
  (@sp, 'san-pham/mainboard/mb-z790-1', 1, 1),
  (@sp, 'san-pham/mainboard/mb-z790-2', 0, 2),
  (@sp, 'san-pham/mainboard/mb-z790-3', 0, 3),
  (@sp, 'san-pham/mainboard/mb-z790-4', 0, 4);

-- Kingston Fury Beast 16GB (2x8GB) DDR4 3200
SET @sp = (SELECT id FROM san_pham WHERE ten = 'Kingston Fury Beast 16GB (2x8GB) DDR4 3200');
INSERT INTO anh_san_pham (id_san_pham, duong_dan, anh_chinh, thu_tu) VALUES
  (@sp, 'san-pham/ram/ram-d4-16-1', 1, 1),
  (@sp, 'san-pham/ram/ram-d4-16-2', 0, 2),
  (@sp, 'san-pham/ram/ram-d4-16-3', 0, 3),
  (@sp, 'san-pham/ram/ram-d4-16-4', 0, 4);
INSERT INTO chi_tiet_san_pham (id_san_pham, so_serial, trang_thai) VALUES
  (@sp, 'SN-RAMD416-0001', 'trong_kho'),
  (@sp, 'SN-RAMD416-0002', 'trong_kho'),
  (@sp, 'SN-RAMD416-0003', 'trong_kho'),
  (@sp, 'SN-RAMD416-0004', 'trong_kho'),
  (@sp, 'SN-RAMD416-0005', 'trong_kho'),
  (@sp, 'SN-RAMD416-0006', 'trong_kho'),
  (@sp, 'SN-RAMD416-0007', 'trong_kho'),
  (@sp, 'SN-RAMD416-0008', 'trong_kho'),
  (@sp, 'SN-RAMD416-0009', 'trong_kho');

-- Corsair Vengeance LPX 32GB (2x16GB) DDR4 3200
SET @sp = (SELECT id FROM san_pham WHERE ten = 'Corsair Vengeance LPX 32GB (2x16GB) DDR4 3200');
INSERT INTO anh_san_pham (id_san_pham, duong_dan, anh_chinh, thu_tu) VALUES
  (@sp, 'san-pham/ram/ram-d4-32-1', 1, 1),
  (@sp, 'san-pham/ram/ram-d4-32-2', 0, 2),
  (@sp, 'san-pham/ram/ram-d4-32-3', 0, 3),
  (@sp, 'san-pham/ram/ram-d4-32-4', 0, 4);
INSERT INTO chi_tiet_san_pham (id_san_pham, so_serial, trang_thai) VALUES
  (@sp, 'SN-RAMD432-0001', 'trong_kho'),
  (@sp, 'SN-RAMD432-0002', 'trong_kho'),
  (@sp, 'SN-RAMD432-0003', 'trong_kho'),
  (@sp, 'SN-RAMD432-0004', 'trong_kho'),
  (@sp, 'SN-RAMD432-0005', 'trong_kho'),
  (@sp, 'SN-RAMD432-0006', 'trong_kho'),
  (@sp, 'SN-RAMD432-0007', 'trong_kho'),
  (@sp, 'SN-RAMD432-0008', 'trong_kho'),
  (@sp, 'SN-RAMD432-0009', 'trong_kho'),
  (@sp, 'SN-RAMD432-0010', 'trong_kho'),
  (@sp, 'SN-RAMD432-0011', 'trong_kho'),
  (@sp, 'SN-RAMD432-0012', 'trong_kho'),
  (@sp, 'SN-RAMD432-0013', 'trong_kho'),
  (@sp, 'SN-RAMD432-0014', 'trong_kho'),
  (@sp, 'SN-RAMD432-0015', 'trong_kho'),
  (@sp, 'SN-RAMD432-0016', 'trong_kho'),
  (@sp, 'SN-RAMD432-0017', 'trong_kho'),
  (@sp, 'SN-RAMD432-0018', 'trong_kho'),
  (@sp, 'SN-RAMD432-0019', 'trong_kho'),
  (@sp, 'SN-RAMD432-0020', 'trong_kho'),
  (@sp, 'SN-RAMD432-0021', 'trong_kho'),
  (@sp, 'SN-RAMD432-0022', 'trong_kho'),
  (@sp, 'SN-RAMD432-0023', 'trong_kho'),
  (@sp, 'SN-RAMD432-0024', 'trong_kho'),
  (@sp, 'SN-RAMD432-0025', 'trong_kho'),
  (@sp, 'SN-RAMD432-0026', 'trong_kho'),
  (@sp, 'SN-RAMD432-0027', 'trong_kho'),
  (@sp, 'SN-RAMD432-0028', 'trong_kho'),
  (@sp, 'SN-RAMD432-0029', 'trong_kho'),
  (@sp, 'SN-RAMD432-0030', 'trong_kho'),
  (@sp, 'SN-RAMD432-0031', 'trong_kho');

-- Kingston Fury Beast 16GB DDR5 5600
SET @sp = (SELECT id FROM san_pham WHERE ten = 'Kingston Fury Beast 16GB DDR5 5600');
INSERT INTO anh_san_pham (id_san_pham, duong_dan, anh_chinh, thu_tu) VALUES
  (@sp, 'san-pham/ram/ram-d5-16-1', 1, 1),
  (@sp, 'san-pham/ram/ram-d5-16-2', 0, 2),
  (@sp, 'san-pham/ram/ram-d5-16-3', 0, 3),
  (@sp, 'san-pham/ram/ram-d5-16-4', 0, 4);
INSERT INTO chi_tiet_san_pham (id_san_pham, so_serial, trang_thai) VALUES
  (@sp, 'SN-RAMD516-0001', 'trong_kho'),
  (@sp, 'SN-RAMD516-0002', 'trong_kho'),
  (@sp, 'SN-RAMD516-0003', 'trong_kho'),
  (@sp, 'SN-RAMD516-0004', 'trong_kho');

-- Corsair Vengeance 32GB (2x16GB) DDR5 5600
SET @sp = (SELECT id FROM san_pham WHERE ten = 'Corsair Vengeance 32GB (2x16GB) DDR5 5600');
INSERT INTO anh_san_pham (id_san_pham, duong_dan, anh_chinh, thu_tu) VALUES
  (@sp, 'san-pham/ram/ram-d5-32-1', 1, 1),
  (@sp, 'san-pham/ram/ram-d5-32-2', 0, 2),
  (@sp, 'san-pham/ram/ram-d5-32-3', 0, 3),
  (@sp, 'san-pham/ram/ram-d5-32-4', 0, 4);
INSERT INTO chi_tiet_san_pham (id_san_pham, so_serial, trang_thai) VALUES
  (@sp, 'SN-RAMD532-0001', 'trong_kho'),
  (@sp, 'SN-RAMD532-0002', 'trong_kho'),
  (@sp, 'SN-RAMD532-0003', 'trong_kho'),
  (@sp, 'SN-RAMD532-0004', 'trong_kho'),
  (@sp, 'SN-RAMD532-0005', 'trong_kho'),
  (@sp, 'SN-RAMD532-0006', 'trong_kho'),
  (@sp, 'SN-RAMD532-0007', 'trong_kho'),
  (@sp, 'SN-RAMD532-0008', 'trong_kho'),
  (@sp, 'SN-RAMD532-0009', 'trong_kho'),
  (@sp, 'SN-RAMD532-0010', 'trong_kho'),
  (@sp, 'SN-RAMD532-0011', 'trong_kho'),
  (@sp, 'SN-RAMD532-0012', 'trong_kho'),
  (@sp, 'SN-RAMD532-0013', 'trong_kho'),
  (@sp, 'SN-RAMD532-0014', 'trong_kho'),
  (@sp, 'SN-RAMD532-0015', 'trong_kho'),
  (@sp, 'SN-RAMD532-0016', 'trong_kho'),
  (@sp, 'SN-RAMD532-0017', 'trong_kho'),
  (@sp, 'SN-RAMD532-0018', 'trong_kho');

-- G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5 6000
SET @sp = (SELECT id FROM san_pham WHERE ten = 'G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5 6000');
INSERT INTO anh_san_pham (id_san_pham, duong_dan, anh_chinh, thu_tu) VALUES
  (@sp, 'san-pham/ram/ram-d5-32z-1', 1, 1),
  (@sp, 'san-pham/ram/ram-d5-32z-2', 0, 2),
  (@sp, 'san-pham/ram/ram-d5-32z-3', 0, 3),
  (@sp, 'san-pham/ram/ram-d5-32z-4', 0, 4);
INSERT INTO chi_tiet_san_pham (id_san_pham, so_serial, trang_thai) VALUES
  (@sp, 'SN-RAMD532Z-0001', 'trong_kho'),
  (@sp, 'SN-RAMD532Z-0002', 'trong_kho');

-- ASUS Dual GeForce RTX 3050 6GB
SET @sp = (SELECT id FROM san_pham WHERE ten = 'ASUS Dual GeForce RTX 3050 6GB');
INSERT INTO anh_san_pham (id_san_pham, duong_dan, anh_chinh, thu_tu) VALUES
  (@sp, 'san-pham/vga/vga-3050-1', 1, 1),
  (@sp, 'san-pham/vga/vga-3050-2', 0, 2),
  (@sp, 'san-pham/vga/vga-3050-3', 0, 3),
  (@sp, 'san-pham/vga/vga-3050-4', 0, 4);
INSERT INTO chi_tiet_san_pham (id_san_pham, so_serial, trang_thai) VALUES
  (@sp, 'SN-VGA3050-0001', 'trong_kho'),
  (@sp, 'SN-VGA3050-0002', 'trong_kho'),
  (@sp, 'SN-VGA3050-0003', 'trong_kho'),
  (@sp, 'SN-VGA3050-0004', 'trong_kho'),
  (@sp, 'SN-VGA3050-0005', 'trong_kho'),
  (@sp, 'SN-VGA3050-0006', 'trong_kho'),
  (@sp, 'SN-VGA3050-0007', 'trong_kho'),
  (@sp, 'SN-VGA3050-0008', 'trong_kho'),
  (@sp, 'SN-VGA3050-0009', 'trong_kho'),
  (@sp, 'SN-VGA3050-0010', 'trong_kho'),
  (@sp, 'SN-VGA3050-0011', 'trong_kho'),
  (@sp, 'SN-VGA3050-0012', 'trong_kho'),
  (@sp, 'SN-VGA3050-0013', 'trong_kho'),
  (@sp, 'SN-VGA3050-0014', 'trong_kho');

-- Sapphire Pulse Radeon RX 7600 8GB
SET @sp = (SELECT id FROM san_pham WHERE ten = 'Sapphire Pulse Radeon RX 7600 8GB');
INSERT INTO anh_san_pham (id_san_pham, duong_dan, anh_chinh, thu_tu) VALUES
  (@sp, 'san-pham/vga/vga-7600-1', 1, 1),
  (@sp, 'san-pham/vga/vga-7600-2', 0, 2),
  (@sp, 'san-pham/vga/vga-7600-3', 0, 3),
  (@sp, 'san-pham/vga/vga-7600-4', 0, 4);
INSERT INTO chi_tiet_san_pham (id_san_pham, so_serial, trang_thai) VALUES
  (@sp, 'SN-VGA7600-0001', 'trong_kho'),
  (@sp, 'SN-VGA7600-0002', 'trong_kho'),
  (@sp, 'SN-VGA7600-0003', 'trong_kho');

-- MSI GeForce RTX 4060 VENTUS 2X 8GB
SET @sp = (SELECT id FROM san_pham WHERE ten = 'MSI GeForce RTX 4060 VENTUS 2X 8GB');
INSERT INTO anh_san_pham (id_san_pham, duong_dan, anh_chinh, thu_tu) VALUES
  (@sp, 'san-pham/vga/vga-4060-1', 1, 1),
  (@sp, 'san-pham/vga/vga-4060-2', 0, 2),
  (@sp, 'san-pham/vga/vga-4060-3', 0, 3),
  (@sp, 'san-pham/vga/vga-4060-4', 0, 4);
INSERT INTO chi_tiet_san_pham (id_san_pham, so_serial, trang_thai) VALUES
  (@sp, 'SN-VGA4060-0001', 'trong_kho'),
  (@sp, 'SN-VGA4060-0002', 'trong_kho'),
  (@sp, 'SN-VGA4060-0003', 'trong_kho'),
  (@sp, 'SN-VGA4060-0004', 'trong_kho'),
  (@sp, 'SN-VGA4060-0005', 'trong_kho'),
  (@sp, 'SN-VGA4060-0006', 'trong_kho'),
  (@sp, 'SN-VGA4060-0007', 'trong_kho'),
  (@sp, 'SN-VGA4060-0008', 'trong_kho'),
  (@sp, 'SN-VGA4060-0009', 'trong_kho'),
  (@sp, 'SN-VGA4060-0010', 'trong_kho'),
  (@sp, 'SN-VGA4060-0011', 'trong_kho'),
  (@sp, 'SN-VGA4060-0012', 'trong_kho'),
  (@sp, 'SN-VGA4060-0013', 'trong_kho'),
  (@sp, 'SN-VGA4060-0014', 'trong_kho'),
  (@sp, 'SN-VGA4060-0015', 'trong_kho'),
  (@sp, 'SN-VGA4060-0016', 'trong_kho'),
  (@sp, 'SN-VGA4060-0017', 'trong_kho'),
  (@sp, 'SN-VGA4060-0018', 'trong_kho'),
  (@sp, 'SN-VGA4060-0019', 'trong_kho'),
  (@sp, 'SN-VGA4060-0020', 'trong_kho'),
  (@sp, 'SN-VGA4060-0021', 'trong_kho'),
  (@sp, 'SN-VGA4060-0022', 'trong_kho');

-- Gigabyte GeForce RTX 4070 SUPER WINDFORCE 12GB
SET @sp = (SELECT id FROM san_pham WHERE ten = 'Gigabyte GeForce RTX 4070 SUPER WINDFORCE 12GB');
INSERT INTO anh_san_pham (id_san_pham, duong_dan, anh_chinh, thu_tu) VALUES
  (@sp, 'san-pham/vga/vga-4070s-1', 1, 1),
  (@sp, 'san-pham/vga/vga-4070s-2', 0, 2),
  (@sp, 'san-pham/vga/vga-4070s-3', 0, 3),
  (@sp, 'san-pham/vga/vga-4070s-4', 0, 4);

-- WD Blue SN580 500GB NVMe
SET @sp = (SELECT id FROM san_pham WHERE ten = 'WD Blue SN580 500GB NVMe');
INSERT INTO anh_san_pham (id_san_pham, duong_dan, anh_chinh, thu_tu) VALUES
  (@sp, 'san-pham/ssd/ssd-sn580-1', 1, 1),
  (@sp, 'san-pham/ssd/ssd-sn580-2', 0, 2),
  (@sp, 'san-pham/ssd/ssd-sn580-3', 0, 3),
  (@sp, 'san-pham/ssd/ssd-sn580-4', 0, 4);
INSERT INTO chi_tiet_san_pham (id_san_pham, so_serial, trang_thai) VALUES
  (@sp, 'SN-SSDSN580-0001', 'trong_kho'),
  (@sp, 'SN-SSDSN580-0002', 'trong_kho'),
  (@sp, 'SN-SSDSN580-0003', 'trong_kho'),
  (@sp, 'SN-SSDSN580-0004', 'trong_kho'),
  (@sp, 'SN-SSDSN580-0005', 'trong_kho'),
  (@sp, 'SN-SSDSN580-0006', 'trong_kho'),
  (@sp, 'SN-SSDSN580-0007', 'trong_kho'),
  (@sp, 'SN-SSDSN580-0008', 'trong_kho'),
  (@sp, 'SN-SSDSN580-0009', 'trong_kho');

-- Kingston NV3 1TB NVMe
SET @sp = (SELECT id FROM san_pham WHERE ten = 'Kingston NV3 1TB NVMe');
INSERT INTO anh_san_pham (id_san_pham, duong_dan, anh_chinh, thu_tu) VALUES
  (@sp, 'san-pham/ssd/ssd-nv3-1', 1, 1),
  (@sp, 'san-pham/ssd/ssd-nv3-2', 0, 2),
  (@sp, 'san-pham/ssd/ssd-nv3-3', 0, 3),
  (@sp, 'san-pham/ssd/ssd-nv3-4', 0, 4);
INSERT INTO chi_tiet_san_pham (id_san_pham, so_serial, trang_thai) VALUES
  (@sp, 'SN-SSDNV3-0001', 'trong_kho'),
  (@sp, 'SN-SSDNV3-0002', 'trong_kho'),
  (@sp, 'SN-SSDNV3-0003', 'trong_kho'),
  (@sp, 'SN-SSDNV3-0004', 'trong_kho'),
  (@sp, 'SN-SSDNV3-0005', 'trong_kho'),
  (@sp, 'SN-SSDNV3-0006', 'trong_kho'),
  (@sp, 'SN-SSDNV3-0007', 'trong_kho'),
  (@sp, 'SN-SSDNV3-0008', 'trong_kho'),
  (@sp, 'SN-SSDNV3-0009', 'trong_kho'),
  (@sp, 'SN-SSDNV3-0010', 'trong_kho'),
  (@sp, 'SN-SSDNV3-0011', 'trong_kho'),
  (@sp, 'SN-SSDNV3-0012', 'trong_kho'),
  (@sp, 'SN-SSDNV3-0013', 'trong_kho'),
  (@sp, 'SN-SSDNV3-0014', 'trong_kho'),
  (@sp, 'SN-SSDNV3-0015', 'trong_kho'),
  (@sp, 'SN-SSDNV3-0016', 'trong_kho'),
  (@sp, 'SN-SSDNV3-0017', 'trong_kho'),
  (@sp, 'SN-SSDNV3-0018', 'trong_kho'),
  (@sp, 'SN-SSDNV3-0019', 'trong_kho'),
  (@sp, 'SN-SSDNV3-0020', 'trong_kho'),
  (@sp, 'SN-SSDNV3-0021', 'trong_kho'),
  (@sp, 'SN-SSDNV3-0022', 'trong_kho'),
  (@sp, 'SN-SSDNV3-0023', 'trong_kho'),
  (@sp, 'SN-SSDNV3-0024', 'trong_kho'),
  (@sp, 'SN-SSDNV3-0025', 'trong_kho'),
  (@sp, 'SN-SSDNV3-0026', 'trong_kho'),
  (@sp, 'SN-SSDNV3-0027', 'trong_kho'),
  (@sp, 'SN-SSDNV3-0028', 'trong_kho'),
  (@sp, 'SN-SSDNV3-0029', 'trong_kho'),
  (@sp, 'SN-SSDNV3-0030', 'trong_kho'),
  (@sp, 'SN-SSDNV3-0031', 'trong_kho');

-- Samsung 980 PRO 1TB NVMe
SET @sp = (SELECT id FROM san_pham WHERE ten = 'Samsung 980 PRO 1TB NVMe');
INSERT INTO anh_san_pham (id_san_pham, duong_dan, anh_chinh, thu_tu) VALUES
  (@sp, 'san-pham/ssd/ssd-980pro-1', 1, 1),
  (@sp, 'san-pham/ssd/ssd-980pro-2', 0, 2),
  (@sp, 'san-pham/ssd/ssd-980pro-3', 0, 3),
  (@sp, 'san-pham/ssd/ssd-980pro-4', 0, 4);
INSERT INTO chi_tiet_san_pham (id_san_pham, so_serial, trang_thai) VALUES
  (@sp, 'SN-SSD980PRO-0001', 'trong_kho'),
  (@sp, 'SN-SSD980PRO-0002', 'trong_kho'),
  (@sp, 'SN-SSD980PRO-0003', 'trong_kho'),
  (@sp, 'SN-SSD980PRO-0004', 'trong_kho');

-- Cooler Master MWE 550W 80 Plus Bronze
SET @sp = (SELECT id FROM san_pham WHERE ten = 'Cooler Master MWE 550W 80 Plus Bronze');
INSERT INTO anh_san_pham (id_san_pham, duong_dan, anh_chinh, thu_tu) VALUES
  (@sp, 'san-pham/nguon/psu-mwe550-1', 1, 1),
  (@sp, 'san-pham/nguon/psu-mwe550-2', 0, 2),
  (@sp, 'san-pham/nguon/psu-mwe550-3', 0, 3),
  (@sp, 'san-pham/nguon/psu-mwe550-4', 0, 4);
INSERT INTO chi_tiet_san_pham (id_san_pham, so_serial, trang_thai) VALUES
  (@sp, 'SN-PSUMWE550-0001', 'trong_kho'),
  (@sp, 'SN-PSUMWE550-0002', 'trong_kho'),
  (@sp, 'SN-PSUMWE550-0003', 'trong_kho'),
  (@sp, 'SN-PSUMWE550-0004', 'trong_kho'),
  (@sp, 'SN-PSUMWE550-0005', 'trong_kho'),
  (@sp, 'SN-PSUMWE550-0006', 'trong_kho'),
  (@sp, 'SN-PSUMWE550-0007', 'trong_kho'),
  (@sp, 'SN-PSUMWE550-0008', 'trong_kho'),
  (@sp, 'SN-PSUMWE550-0009', 'trong_kho'),
  (@sp, 'SN-PSUMWE550-0010', 'trong_kho'),
  (@sp, 'SN-PSUMWE550-0011', 'trong_kho'),
  (@sp, 'SN-PSUMWE550-0012', 'trong_kho'),
  (@sp, 'SN-PSUMWE550-0013', 'trong_kho'),
  (@sp, 'SN-PSUMWE550-0014', 'trong_kho'),
  (@sp, 'SN-PSUMWE550-0015', 'trong_kho'),
  (@sp, 'SN-PSUMWE550-0016', 'trong_kho'),
  (@sp, 'SN-PSUMWE550-0017', 'trong_kho'),
  (@sp, 'SN-PSUMWE550-0018', 'trong_kho');

-- Corsair RM750e 750W 80 Plus Gold
SET @sp = (SELECT id FROM san_pham WHERE ten = 'Corsair RM750e 750W 80 Plus Gold');
INSERT INTO anh_san_pham (id_san_pham, duong_dan, anh_chinh, thu_tu) VALUES
  (@sp, 'san-pham/nguon/psu-rm750-1', 1, 1),
  (@sp, 'san-pham/nguon/psu-rm750-2', 0, 2),
  (@sp, 'san-pham/nguon/psu-rm750-3', 0, 3),
  (@sp, 'san-pham/nguon/psu-rm750-4', 0, 4);
INSERT INTO chi_tiet_san_pham (id_san_pham, so_serial, trang_thai) VALUES
  (@sp, 'SN-PSURM750-0001', 'trong_kho'),
  (@sp, 'SN-PSURM750-0002', 'trong_kho');

-- Seasonic Focus GX-850 850W 80 Plus Gold
SET @sp = (SELECT id FROM san_pham WHERE ten = 'Seasonic Focus GX-850 850W 80 Plus Gold');
INSERT INTO anh_san_pham (id_san_pham, duong_dan, anh_chinh, thu_tu) VALUES
  (@sp, 'san-pham/nguon/psu-ss850-1', 1, 1),
  (@sp, 'san-pham/nguon/psu-ss850-2', 0, 2),
  (@sp, 'san-pham/nguon/psu-ss850-3', 0, 3),
  (@sp, 'san-pham/nguon/psu-ss850-4', 0, 4);
INSERT INTO chi_tiet_san_pham (id_san_pham, so_serial, trang_thai) VALUES
  (@sp, 'SN-PSUSS850-0001', 'trong_kho'),
  (@sp, 'SN-PSUSS850-0002', 'trong_kho'),
  (@sp, 'SN-PSUSS850-0003', 'trong_kho'),
  (@sp, 'SN-PSUSS850-0004', 'trong_kho'),
  (@sp, 'SN-PSUSS850-0005', 'trong_kho'),
  (@sp, 'SN-PSUSS850-0006', 'trong_kho'),
  (@sp, 'SN-PSUSS850-0007', 'trong_kho'),
  (@sp, 'SN-PSUSS850-0008', 'trong_kho'),
  (@sp, 'SN-PSUSS850-0009', 'trong_kho'),
  (@sp, 'SN-PSUSS850-0010', 'trong_kho'),
  (@sp, 'SN-PSUSS850-0011', 'trong_kho'),
  (@sp, 'SN-PSUSS850-0012', 'trong_kho'),
  (@sp, 'SN-PSUSS850-0013', 'trong_kho'),
  (@sp, 'SN-PSUSS850-0014', 'trong_kho');

-- Xigmatek Gaming X 3 quạt
SET @sp = (SELECT id FROM san_pham WHERE ten = 'Xigmatek Gaming X 3 quạt');
INSERT INTO anh_san_pham (id_san_pham, duong_dan, anh_chinh, thu_tu) VALUES
  (@sp, 'san-pham/case/case-xig-1', 1, 1),
  (@sp, 'san-pham/case/case-xig-2', 0, 2),
  (@sp, 'san-pham/case/case-xig-3', 0, 3),
  (@sp, 'san-pham/case/case-xig-4', 0, 4);
INSERT INTO chi_tiet_san_pham (id_san_pham, so_serial, trang_thai) VALUES
  (@sp, 'SN-CASEXIG-0001', 'trong_kho'),
  (@sp, 'SN-CASEXIG-0002', 'trong_kho'),
  (@sp, 'SN-CASEXIG-0003', 'trong_kho');

-- NZXT H5 Flow
SET @sp = (SELECT id FROM san_pham WHERE ten = 'NZXT H5 Flow');
INSERT INTO anh_san_pham (id_san_pham, duong_dan, anh_chinh, thu_tu) VALUES
  (@sp, 'san-pham/case/case-h5-1', 1, 1),
  (@sp, 'san-pham/case/case-h5-2', 0, 2),
  (@sp, 'san-pham/case/case-h5-3', 0, 3),
  (@sp, 'san-pham/case/case-h5-4', 0, 4);
INSERT INTO chi_tiet_san_pham (id_san_pham, so_serial, trang_thai) VALUES
  (@sp, 'SN-CASEH5-0001', 'trong_kho'),
  (@sp, 'SN-CASEH5-0002', 'trong_kho'),
  (@sp, 'SN-CASEH5-0003', 'trong_kho'),
  (@sp, 'SN-CASEH5-0004', 'trong_kho'),
  (@sp, 'SN-CASEH5-0005', 'trong_kho'),
  (@sp, 'SN-CASEH5-0006', 'trong_kho'),
  (@sp, 'SN-CASEH5-0007', 'trong_kho'),
  (@sp, 'SN-CASEH5-0008', 'trong_kho'),
  (@sp, 'SN-CASEH5-0009', 'trong_kho'),
  (@sp, 'SN-CASEH5-0010', 'trong_kho'),
  (@sp, 'SN-CASEH5-0011', 'trong_kho'),
  (@sp, 'SN-CASEH5-0012', 'trong_kho'),
  (@sp, 'SN-CASEH5-0013', 'trong_kho'),
  (@sp, 'SN-CASEH5-0014', 'trong_kho'),
  (@sp, 'SN-CASEH5-0015', 'trong_kho'),
  (@sp, 'SN-CASEH5-0016', 'trong_kho'),
  (@sp, 'SN-CASEH5-0017', 'trong_kho'),
  (@sp, 'SN-CASEH5-0018', 'trong_kho'),
  (@sp, 'SN-CASEH5-0019', 'trong_kho'),
  (@sp, 'SN-CASEH5-0020', 'trong_kho'),
  (@sp, 'SN-CASEH5-0021', 'trong_kho'),
  (@sp, 'SN-CASEH5-0022', 'trong_kho');

-- LG 24GN600 24" IPS 144Hz
SET @sp = (SELECT id FROM san_pham WHERE ten = 'LG 24GN600 24" IPS 144Hz');
INSERT INTO anh_san_pham (id_san_pham, duong_dan, anh_chinh, thu_tu) VALUES
  (@sp, 'san-pham/man-hinh/mon-lg24-1', 1, 1),
  (@sp, 'san-pham/man-hinh/mon-lg24-2', 0, 2),
  (@sp, 'san-pham/man-hinh/mon-lg24-3', 0, 3),
  (@sp, 'san-pham/man-hinh/mon-lg24-4', 0, 4);

-- Dell S2722DGM 27" VA 165Hz 2K
SET @sp = (SELECT id FROM san_pham WHERE ten = 'Dell S2722DGM 27" VA 165Hz 2K');
INSERT INTO anh_san_pham (id_san_pham, duong_dan, anh_chinh, thu_tu) VALUES
  (@sp, 'san-pham/man-hinh/mon-dell27-1', 1, 1),
  (@sp, 'san-pham/man-hinh/mon-dell27-2', 0, 2),
  (@sp, 'san-pham/man-hinh/mon-dell27-3', 0, 3),
  (@sp, 'san-pham/man-hinh/mon-dell27-4', 0, 4);
INSERT INTO chi_tiet_san_pham (id_san_pham, so_serial, trang_thai) VALUES
  (@sp, 'SN-MONDELL27-0001', 'trong_kho'),
  (@sp, 'SN-MONDELL27-0002', 'trong_kho'),
  (@sp, 'SN-MONDELL27-0003', 'trong_kho'),
  (@sp, 'SN-MONDELL27-0004', 'trong_kho'),
  (@sp, 'SN-MONDELL27-0005', 'trong_kho'),
  (@sp, 'SN-MONDELL27-0006', 'trong_kho'),
  (@sp, 'SN-MONDELL27-0007', 'trong_kho'),
  (@sp, 'SN-MONDELL27-0008', 'trong_kho'),
  (@sp, 'SN-MONDELL27-0009', 'trong_kho');

-- Logitech G102 Lightsync
SET @sp = (SELECT id FROM san_pham WHERE ten = 'Logitech G102 Lightsync');
INSERT INTO anh_san_pham (id_san_pham, duong_dan, anh_chinh, thu_tu) VALUES
  (@sp, 'san-pham/chuot/mouse-g102-1', 1, 1),
  (@sp, 'san-pham/chuot/mouse-g102-2', 0, 2),
  (@sp, 'san-pham/chuot/mouse-g102-3', 0, 3),
  (@sp, 'san-pham/chuot/mouse-g102-4', 0, 4);
INSERT INTO chi_tiet_san_pham (id_san_pham, so_serial, trang_thai) VALUES
  (@sp, 'SN-MOUSEG102-0001', 'trong_kho'),
  (@sp, 'SN-MOUSEG102-0002', 'trong_kho'),
  (@sp, 'SN-MOUSEG102-0003', 'trong_kho'),
  (@sp, 'SN-MOUSEG102-0004', 'trong_kho'),
  (@sp, 'SN-MOUSEG102-0005', 'trong_kho'),
  (@sp, 'SN-MOUSEG102-0006', 'trong_kho'),
  (@sp, 'SN-MOUSEG102-0007', 'trong_kho'),
  (@sp, 'SN-MOUSEG102-0008', 'trong_kho'),
  (@sp, 'SN-MOUSEG102-0009', 'trong_kho'),
  (@sp, 'SN-MOUSEG102-0010', 'trong_kho'),
  (@sp, 'SN-MOUSEG102-0011', 'trong_kho'),
  (@sp, 'SN-MOUSEG102-0012', 'trong_kho'),
  (@sp, 'SN-MOUSEG102-0013', 'trong_kho'),
  (@sp, 'SN-MOUSEG102-0014', 'trong_kho'),
  (@sp, 'SN-MOUSEG102-0015', 'trong_kho'),
  (@sp, 'SN-MOUSEG102-0016', 'trong_kho'),
  (@sp, 'SN-MOUSEG102-0017', 'trong_kho'),
  (@sp, 'SN-MOUSEG102-0018', 'trong_kho'),
  (@sp, 'SN-MOUSEG102-0019', 'trong_kho'),
  (@sp, 'SN-MOUSEG102-0020', 'trong_kho'),
  (@sp, 'SN-MOUSEG102-0021', 'trong_kho'),
  (@sp, 'SN-MOUSEG102-0022', 'trong_kho'),
  (@sp, 'SN-MOUSEG102-0023', 'trong_kho'),
  (@sp, 'SN-MOUSEG102-0024', 'trong_kho'),
  (@sp, 'SN-MOUSEG102-0025', 'trong_kho'),
  (@sp, 'SN-MOUSEG102-0026', 'trong_kho'),
  (@sp, 'SN-MOUSEG102-0027', 'trong_kho'),
  (@sp, 'SN-MOUSEG102-0028', 'trong_kho'),
  (@sp, 'SN-MOUSEG102-0029', 'trong_kho'),
  (@sp, 'SN-MOUSEG102-0030', 'trong_kho'),
  (@sp, 'SN-MOUSEG102-0031', 'trong_kho');

-- Razer DeathAdder V3
SET @sp = (SELECT id FROM san_pham WHERE ten = 'Razer DeathAdder V3');
INSERT INTO anh_san_pham (id_san_pham, duong_dan, anh_chinh, thu_tu) VALUES
  (@sp, 'san-pham/chuot/mouse-da3-1', 1, 1),
  (@sp, 'san-pham/chuot/mouse-da3-2', 0, 2),
  (@sp, 'san-pham/chuot/mouse-da3-3', 0, 3),
  (@sp, 'san-pham/chuot/mouse-da3-4', 0, 4);
INSERT INTO chi_tiet_san_pham (id_san_pham, so_serial, trang_thai) VALUES
  (@sp, 'SN-MOUSEDA3-0001', 'trong_kho'),
  (@sp, 'SN-MOUSEDA3-0002', 'trong_kho'),
  (@sp, 'SN-MOUSEDA3-0003', 'trong_kho'),
  (@sp, 'SN-MOUSEDA3-0004', 'trong_kho');

INSERT INTO ma_giam_gia (ma, loai, gia_tri, don_toi_thieu, ngay_het_han, hoat_dong) VALUES
  ('TECH10', 'phan_tram', 10, 2000000, '2026-12-31', 1),
  ('GIAM200K', 'so_tien', 200000, 3000000, '2026-11-30', 1),
  ('NEWUSER', 'phan_tram', 5, 0, '2026-09-30', 0);
