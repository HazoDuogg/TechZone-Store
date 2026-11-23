USE techzone;

INSERT INTO danh_muc (ten, anh_dai_dien) VALUES
  ('CPU', 'danh-muc/cat-cpu'), ('Mainboard', 'danh-muc/cat-mainboard'), ('RAM', 'danh-muc/cat-ram'),
  ('VGA', 'danh-muc/cat-vga'), ('SSD', 'danh-muc/cat-ssd'), ('Nguồn', 'danh-muc/cat-nguon'),
  ('Case', 'danh-muc/cat-case'), ('Màn hình', 'danh-muc/cat-man-hinh'), ('Chuột', 'danh-muc/cat-chuot');

INSERT INTO tai_khoan (email, mat_khau, vai_tro)
VALUES ('admin@techzone.vn', '$2b$10$iky8NH2O8Ob.3WrCIfYsmOxZ6vEKa74xAHL2UDivCjDp8OEwfqUi2', 'admin');
