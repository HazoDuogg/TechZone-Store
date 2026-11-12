CREATE DATABASE IF NOT EXISTS techzone CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE techzone;

CREATE TABLE tai_khoan (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  username    VARCHAR(50)  NOT NULL,
  email       VARCHAR(100) NOT NULL,
  mat_khau    VARCHAR(255) NOT NULL,
  vai_tro     ENUM('khach_hang','nhan_vien','admin') NOT NULL,
  trang_thai  ENUM('hoat_dong','khoa') NOT NULL DEFAULT 'hoat_dong',
  PRIMARY KEY (id),
  UNIQUE KEY uq_tai_khoan_username (username),
  UNIQUE KEY uq_tai_khoan_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE khach_hang (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_tai_khoan   INT UNSIGNED NOT NULL,
  ho_ten         VARCHAR(100) NOT NULL,
  so_dien_thoai  VARCHAR(15)  NOT NULL,
  ghi_chu        VARCHAR(255) NULL,
  ngay_tao       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_khach_hang_tai_khoan (id_tai_khoan),
  FOREIGN KEY (id_tai_khoan) REFERENCES tai_khoan(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE dia_chi_giao_hang (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_khach_hang   INT UNSIGNED NOT NULL,
  ten_nguoi_nhan  VARCHAR(100) NOT NULL,
  so_dien_thoai   VARCHAR(15)  NOT NULL,
  dia_chi         VARCHAR(255) NOT NULL,
  mac_dinh        TINYINT(1)   NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  FOREIGN KEY (id_khach_hang) REFERENCES khach_hang(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE nhan_vien (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_tai_khoan   INT UNSIGNED NOT NULL,
  ho_ten         VARCHAR(100) NOT NULL,
  so_dien_thoai  VARCHAR(15)  NOT NULL,
  vi_tri         ENUM('ban_hang','ky_thuat','kho') NOT NULL,
  trang_thai     ENUM('hoat_dong','nghi_viec') NOT NULL DEFAULT 'hoat_dong',
  ngay_tao       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_nhan_vien_tai_khoan (id_tai_khoan),
  FOREIGN KEY (id_tai_khoan) REFERENCES tai_khoan(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE danh_muc (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  ten           VARCHAR(100) NOT NULL,
  mo_ta         VARCHAR(255) NULL,
  anh_dai_dien  VARCHAR(255) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_danh_muc_ten (ten)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE san_pham (
  id                INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_danh_muc       INT UNSIGNED NOT NULL,
  ten               VARCHAR(200) NOT NULL,
  thuong_hieu       VARCHAR(100) NULL,
  gia               DECIMAL(12,0) NOT NULL,
  gia_niem_yet      DECIMAL(12,0) NULL,
  mo_ta             TEXT NULL,
  thong_so          JSON NULL,
  so_thang_bao_hanh TINYINT UNSIGNED NOT NULL DEFAULT 12,
  trang_thai        ENUM('cho_bo_sung','dang_ban','ngung_ban') NOT NULL DEFAULT 'cho_bo_sung',
  PRIMARY KEY (id),
  FOREIGN KEY (id_danh_muc) REFERENCES danh_muc(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE anh_san_pham (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_san_pham  INT UNSIGNED NOT NULL,
  duong_dan    VARCHAR(255) NOT NULL,
  anh_chinh    TINYINT(1) NOT NULL DEFAULT 0,
  thu_tu       TINYINT UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  FOREIGN KEY (id_san_pham) REFERENCES san_pham(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE ma_giam_gia (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  ma             VARCHAR(30) NOT NULL,
  loai           ENUM('phan_tram','so_tien') NOT NULL,
  gia_tri        DECIMAL(12,0) NOT NULL,
  don_toi_thieu  DECIMAL(12,0) NOT NULL DEFAULT 0,
  ngay_het_han   DATE NULL,
  hoat_dong      TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_ma_giam_gia_ma (ma)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE don_hang (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  ma              VARCHAR(20) NOT NULL,
  id_khach_hang   INT UNSIGNED NULL,
  id_nhan_vien    INT UNSIGNED NULL,
  id_ma_giam_gia  INT UNSIGNED NULL,
  ten_nguoi_nhan  VARCHAR(100) NOT NULL,
  so_dien_thoai   VARCHAR(15)  NOT NULL,
  email           VARCHAR(100) NULL,
  dia_chi         VARCHAR(255) NOT NULL,
  phi_van_chuyen  DECIMAL(12,0) NOT NULL DEFAULT 0,
  tien_giam       DECIMAL(12,0) NOT NULL DEFAULT 0,
  trang_thai      ENUM('cho_xac_nhan','da_xac_nhan','dang_giao','hoan_tat','da_huy') NOT NULL DEFAULT 'cho_xac_nhan',
  ngay_dat        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngay_hoan_tat   DATETIME NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_don_hang_ma (ma),
  FOREIGN KEY (id_khach_hang)  REFERENCES khach_hang(id),
  FOREIGN KEY (id_nhan_vien)   REFERENCES nhan_vien(id),
  FOREIGN KEY (id_ma_giam_gia) REFERENCES ma_giam_gia(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE chi_tiet_don_hang (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_don_hang  INT UNSIGNED NOT NULL,
  id_san_pham  INT UNSIGNED NOT NULL,
  so_luong     INT UNSIGNED NOT NULL,
  don_gia      DECIMAL(12,0) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_ctdh_don_sp (id_don_hang, id_san_pham),
  FOREIGN KEY (id_don_hang) REFERENCES don_hang(id),
  FOREIGN KEY (id_san_pham) REFERENCES san_pham(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE chi_tiet_san_pham (
  id                    INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_san_pham           INT UNSIGNED NOT NULL,
  id_chi_tiet_don_hang  INT UNSIGNED NULL,
  so_serial             VARCHAR(50) NOT NULL,
  trang_thai            ENUM('trong_kho','da_ban','dang_bao_hanh','loi') NOT NULL DEFAULT 'trong_kho',
  ngay_nhap             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_ctsp_serial (so_serial),
  FOREIGN KEY (id_san_pham) REFERENCES san_pham(id),
  FOREIGN KEY (id_chi_tiet_don_hang) REFERENCES chi_tiet_don_hang(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE thanh_toan (
  id               INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_don_hang      INT UNSIGNED NOT NULL,
  phuong_thuc      ENUM('cod','chuyen_khoan','the','vi_dien_tu') NOT NULL,
  so_tien          DECIMAL(12,0) NOT NULL,
  trang_thai       ENUM('cho_thanh_toan','thanh_cong','that_bai','hoan_tien') NOT NULL DEFAULT 'cho_thanh_toan',
  ma_giao_dich     VARCHAR(50) NULL,
  ngay_thanh_toan  DATETIME NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id_don_hang) REFERENCES don_hang(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE phieu_nhap_xuat (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_nhan_vien  INT UNSIGNED NOT NULL,
  loai          ENUM('nhap','xuat') NOT NULL,
  ngay_lap      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ghi_chu       VARCHAR(255) NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id_nhan_vien) REFERENCES nhan_vien(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE chi_tiet_phieu_kho (
  id                  INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_phieu_nhap_xuat  INT UNSIGNED NOT NULL,
  id_san_pham         INT UNSIGNED NOT NULL,
  so_luong            INT UNSIGNED NOT NULL,
  ghi_chu             VARCHAR(255) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_ctpk_phieu_sp (id_phieu_nhap_xuat, id_san_pham),
  FOREIGN KEY (id_phieu_nhap_xuat) REFERENCES phieu_nhap_xuat(id),
  FOREIGN KEY (id_san_pham) REFERENCES san_pham(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE bao_hanh (
  id                    INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_chi_tiet_san_pham  INT UNSIGNED NOT NULL,
  id_nhan_vien          INT UNSIGNED NULL,
  mo_ta_loi             VARCHAR(500) NOT NULL,
  trang_thai            ENUM('tiep_nhan','dang_xu_ly','hoan_tat','tu_choi') NOT NULL DEFAULT 'tiep_nhan',
  ket_qua               VARCHAR(500) NULL,
  ngay_tiep_nhan        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngay_hoan_thanh       DATETIME NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id_chi_tiet_san_pham) REFERENCES chi_tiet_san_pham(id),
  FOREIGN KEY (id_nhan_vien) REFERENCES nhan_vien(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
