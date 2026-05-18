DELETE FROM menu_items;

INSERT INTO menu_items (name, description, price, category, image_url) VALUES
-- Pasta Menu
('Classic Spaghetti Carbonara', 'Creamy classic spaghetti carbonara served with poached egg and garlic bread.', 195.00, 'pasta', '/images/menu/pasta-menu.jpg'),
('Asian Chicken Pasta', 'Sweet and spicy Asian-style pasta with tender chicken and mushrooms, served with garlic bread.', 185.00, 'pasta', '/images/menu/pasta-menu.jpg'),
('Pinoy Style Spaghetti', 'Sweet-style Filipino spaghetti topped with hotdogs and grated cheese, served with garlic bread.', 175.00, 'pasta', '/images/menu/pasta-menu.jpg'),
('Fettuccine Bolognese', 'Fettuccine pasta in rich savory Bolognese sauce, topped with parmesan cheese and basil oil, served with garlic bread.', 195.00, 'pasta', '/images/menu/pasta-menu.jpg'),
('Fettuccine Chicken Alfredo', 'Fettuccine pasta in creamy Alfredo sauce with chicken tenders, served with garlic bread.', 185.00, 'pasta', '/images/menu/pasta-menu.jpg'),
('Creamy Ham & Mushroom Fettuccine', 'Fettuccine pasta in creamy parmesan sauce with ham and mushrooms, served with garlic bread.', 185.00, 'pasta', '/images/menu/pasta-menu.jpg'),

-- Fries and Appetizers
('Classic French Fries Solo', 'Golden crispy fries, perfectly spiced, served with tomato ketchup dip.', 85.00, 'fries', '/images/menu/fries-appetizer.jpg'),
('Classic French Fries Sharing', 'Golden crispy fries, perfectly spiced, served with tomato ketchup dip.', 165.00, 'fries', '/images/menu/fries-appetizer.jpg'),
('Cheese Fries Solo', 'Crispy fries topped with creamy cheddar cheese sauce, served with BBQ dip.', 95.00, 'fries', '/images/menu/fries-appetizer.jpg'),
('Cheese Fries Sharing', 'Crispy fries topped with creamy cheddar cheese sauce, served with BBQ dip.', 185.00, 'fries', '/images/menu/fries-appetizer.jpg'),
('Mozzarella Stick Solo', 'Creamy mozzarella coated in herbed breadcrumbs, crispy golden, served with BBQ dip.', 145.00, 'appetizer', '/images/menu/fries-appetizer.jpg'),
('Mozzarella Stick Sharing', 'Creamy mozzarella coated in herbed breadcrumbs, crispy golden, served with BBQ dip.', 285.00, 'appetizer', '/images/menu/fries-appetizer.jpg'),
('Nacho Fries', 'Crispy fries loaded with mango salsa, chili con carne, sour cream and cheddar cheese sauce.', 249.00, 'fries', '/images/menu/fries-appetizer.jpg'),
('Pulled Pork BBQ Fries', 'Crispy fries topped with tender BBQ pulled pork, finished with lemon garlic aioli.', 249.00, 'fries', '/images/menu/fries-appetizer.jpg'),
('Garlic Parmesan Potato Wedges', 'Homemade potato wedges tossed with garlic oil, parmesan cheese and fried garlic, served with lemon garlic aioli.', 175.00, 'wedges', '/images/menu/fries-appetizer.jpg'),
('Vinyard Style Potato Wedges', 'Homemade potato wedges topped with parmesan cheese, bacon bits and signature Vinyard sauce.', 195.00, 'wedges', '/images/menu/fries-appetizer.jpg'),
('Spicy Salted Egg Potato Wedges', 'Homemade potato wedges coated in rich spicy salted egg, served with creamy sour cream.', 185.00, 'wedges', '/images/menu/fries-appetizer.jpg'),

-- Sizzling Rice Meal
('Sizzling Burger Steak with Egg', 'Homemade beef patties smothered in rich mushroom gravy, served hot with rice.', 145.00, 'rice_meal', '/images/menu/rice-meal.jpg'),
('Sizzling Luncheon Meat with Egg', 'Three slices of savory luncheon meat with sunny side-up egg, drizzled with teriyaki sauce, served hot with rice.', 125.00, 'rice_meal', '/images/menu/rice-meal.jpg'),
('Pulled Pork BBQ with Egg', 'Savory BBQ pulled pork with sunny side up egg, served hot with rice.', 145.00, 'rice_meal', '/images/menu/rice-meal.jpg'),
('Smoked BBQ Pork Belly', 'Savory smoked BBQ pork belly, served hot with rice.', 185.00, 'rice_meal', '/images/menu/rice-meal.jpg'),
('Sizzling Hungarian Sausage with Egg', 'Juicy Hungarian sausage with sunny side up egg and gravy, served hot with rice.', 125.00, 'rice_meal', '/images/menu/rice-meal.jpg'),

-- Burger Menu
('Vinyard Classic Burger', 'Home-made pure beef patty topped with cheddar cheese sauce, fresh lettuce, onions, and signature Vinyard burger sauce.', 175.00, 'burger', '/images/menu/burger-menu.jpg'),
('Vinyard Cheese Burger', 'Home-made pure beef patty topped with sliced cheese and cheddar cheese sauce, caramelized onions, fresh lettuce, fresh tomato and signature Vinyard burger sauce.', 185.00, 'burger', '/images/menu/burger-menu.jpg'),
('Chef''s Choice Burger', 'Home-made pure beef patty topped with bacon, sliced cheese, onions, fresh lettuce, fresh tomato, and signature Vinyard sauce.', 215.00, 'burger', '/images/menu/burger-menu.jpg'),
('Double CC Burger', 'Double home-made beef patties topped with bacon, sliced cheese, onions, fresh lettuce, fresh tomato, and signature Vinyard sauce.', 295.00, 'burger', '/images/menu/burger-menu.jpg'),
('Bacon BBQ Burger', 'Home-made beef patty topped with bacon, sliced cheese, fresh lettuce, fresh tomato, onions, garlic aioli, and BBQ sauce.', 215.00, 'burger', '/images/menu/burger-menu.jpg'),
('BLT Burger', 'Home-made beef patty loaded with bacon, sliced cheese and cheddar sauce, fresh lettuce, fresh tomato, and signature Vinyard sauce.', 215.00, 'burger', '/images/menu/burger-menu.jpg'),
('Double BLT Burger', 'Double home-made beef patty loaded with bacon, sliced cheese and cheddar sauce, fresh lettuce, fresh tomato, and signature Vinyard sauce.', 295.00, 'burger', '/images/menu/burger-menu.jpg'),
('Hawaiian BBQ Burger', 'Home-made beef patty topped with sweet pineapple, sliced cheese, fresh tomato, caramelized onions, lettuce, garlic aioli, and BBQ sauce.', 185.00, 'burger', '/images/menu/burger-menu.jpg'),
('Titan Ultimate Burger', 'Triple layer home-made beef patties loaded with 3 cheese slices, bacon, cheddar cheese sauce, caramelized onions, fresh lettuce, fresh tomato, and signature Vinyard sauce.', 379.00, 'burger', '/images/menu/burger-menu.jpg'),
('Burger Fries & Drink Add-on', 'Add fries and drinks to any burger.', 55.00, 'add_ons', '/images/menu/burger-menu.jpg'),

-- Flavored Chicken
('Classic Fried Chicken - 3 Pieces', 'Classic fried chicken. Number of pieces: 3.', 175.00, 'fried_chicken', '/images/menu/fried-chicken.jpg'),
('Classic Fried Chicken - 6 Pieces', 'Classic fried chicken. Number of pieces: 6.', 350.00, 'fried_chicken', '/images/menu/fried-chicken.jpg'),
('Classic Fried Chicken - 9 Pieces', 'Classic fried chicken. Number of pieces: 9.', 515.00, 'fried_chicken', '/images/menu/fried-chicken.jpg'),
('Garlic Parmesan Chicken - 3 Pieces', 'Garlic parmesan flavored chicken. Number of pieces: 3.', 175.00, 'fried_chicken', '/images/menu/fried-chicken.jpg'),
('Garlic Parmesan Chicken - 6 Pieces', 'Garlic parmesan flavored chicken. Number of pieces: 6.', 350.00, 'fried_chicken', '/images/menu/fried-chicken.jpg'),
('Garlic Parmesan Chicken - 9 Pieces', 'Garlic parmesan flavored chicken. Number of pieces: 9.', 515.00, 'fried_chicken', '/images/menu/fried-chicken.jpg'),
('Ranch BBQ Chicken - 3 Pieces', 'Ranch BBQ flavored chicken. Number of pieces: 3.', 175.00, 'fried_chicken', '/images/menu/fried-chicken.jpg'),
('Ranch BBQ Chicken - 6 Pieces', 'Ranch BBQ flavored chicken. Number of pieces: 6.', 350.00, 'fried_chicken', '/images/menu/fried-chicken.jpg'),
('Ranch BBQ Chicken - 9 Pieces', 'Ranch BBQ flavored chicken. Number of pieces: 9.', 515.00, 'fried_chicken', '/images/menu/fried-chicken.jpg'),
('Sweet Chilli Fried Chicken - 3 Pieces', 'Sweet chilli fried chicken. Number of pieces: 3.', 175.00, 'fried_chicken', '/images/menu/fried-chicken.jpg'),
('Sweet Chilli Fried Chicken - 6 Pieces', 'Sweet chilli fried chicken. Number of pieces: 6.', 350.00, 'fried_chicken', '/images/menu/fried-chicken.jpg'),
('Sweet Chilli Fried Chicken - 9 Pieces', 'Sweet chilli fried chicken. Number of pieces: 9.', 515.00, 'fried_chicken', '/images/menu/fried-chicken.jpg'),
('Spicy Sriracha Mayo Chicken - 3 Pieces', 'Spicy sriracha mayo flavored chicken. Number of pieces: 3.', 175.00, 'fried_chicken', '/images/menu/fried-chicken.jpg'),
('Spicy Sriracha Mayo Chicken - 6 Pieces', 'Spicy sriracha mayo flavored chicken. Number of pieces: 6.', 350.00, 'fried_chicken', '/images/menu/fried-chicken.jpg'),
('Spicy Sriracha Mayo Chicken - 9 Pieces', 'Spicy sriracha mayo flavored chicken. Number of pieces: 9.', 515.00, 'fried_chicken', '/images/menu/fried-chicken.jpg'),
('Flavored Chicken with Drinks Solo', 'Flavored chicken with drinks. Choose rice or fries.', 165.00, 'fried_chicken', '/images/menu/fried-chicken.jpg'),
('Flavored Chicken with Drinks Double', 'Flavored chicken with drinks. Choose rice or fries.', 310.00, 'fried_chicken', '/images/menu/fried-chicken.jpg'),
('Flavored Chicken with Drinks Family', 'Flavored chicken with drinks. Choose rice or fries.', 485.00, 'fried_chicken', '/images/menu/fried-chicken.jpg'),

-- Coffee Menu
('Vanilla Cold Brew 12oz', 'Iced coffee made with premium Arabica beans.', 85.00, 'coffee', '/images/menu/coffee-menu.jpg'),
('Vanilla Cold Brew 16oz', 'Iced coffee made with premium Arabica beans.', 95.00, 'coffee', '/images/menu/coffee-menu.jpg'),
('Iced Coffee Latte 12oz', 'Iced coffee latte made with premium Arabica beans.', 109.00, 'coffee', '/images/menu/coffee-menu.jpg'),
('Iced Coffee Latte 16oz', 'Iced coffee latte made with premium Arabica beans.', 119.00, 'coffee', '/images/menu/coffee-menu.jpg'),
('Iced Spanish Latte 12oz', 'Iced Spanish latte made with premium Arabica beans.', 115.00, 'coffee', '/images/menu/coffee-menu.jpg'),
('Iced Spanish Latte 16oz', 'Iced Spanish latte made with premium Arabica beans.', 125.00, 'coffee', '/images/menu/coffee-menu.jpg'),
('Iced Caramel Macchiato 12oz', 'Iced caramel macchiato made with premium Arabica beans.', 125.00, 'coffee', '/images/menu/coffee-menu.jpg'),
('Iced Caramel Macchiato 16oz', 'Iced caramel macchiato made with premium Arabica beans.', 135.00, 'coffee', '/images/menu/coffee-menu.jpg'),
('Iced Mocha 12oz', 'Iced mocha made with premium Arabica beans.', 145.00, 'coffee', '/images/menu/coffee-menu.jpg'),
('Iced Mocha 16oz', 'Iced mocha made with premium Arabica beans.', 155.00, 'coffee', '/images/menu/coffee-menu.jpg'),

-- Frappe
('Vanilla Frappe 12oz', 'Vanilla frappe.', 125.00, 'frappe', '/images/menu/coffee-menu.jpg'),
('Vanilla Frappe 16oz', 'Vanilla frappe.', 135.00, 'frappe', '/images/menu/coffee-menu.jpg'),
('Caramel Frappe 12oz', 'Caramel frappe.', 160.00, 'frappe', '/images/menu/coffee-menu.jpg'),
('Caramel Frappe 16oz', 'Caramel frappe.', 170.00, 'frappe', '/images/menu/coffee-menu.jpg'),
('Chocolate Frappe 12oz', 'Chocolate frappe.', 165.00, 'frappe', '/images/menu/coffee-menu.jpg'),
('Chocolate Frappe 16oz', 'Chocolate frappe.', 175.00, 'frappe', '/images/menu/coffee-menu.jpg'),
('Mocha Frappe 12oz', 'Mocha frappe.', 175.00, 'frappe', '/images/menu/coffee-menu.jpg'),
('Mocha Frappe 16oz', 'Mocha frappe.', 185.00, 'frappe', '/images/menu/coffee-menu.jpg'),

-- Milk Shake
('Mango Shake', 'Mango milk shake.', 105.00, 'milk_shake', '/images/menu/coffee-menu.jpg'),
('Strawberry Shake', 'Strawberry milk shake.', 105.00, 'milk_shake', '/images/menu/coffee-menu.jpg'),

-- Beverages
('Coke', 'Cold bottled or canned soft drink.', 35.00, 'beverages', '/images/menu/coffee-menu.jpg'),
('Sprite', 'Cold bottled or canned soft drink.', 35.00, 'beverages', '/images/menu/coffee-menu.jpg'),
('Lemon Iced Tea', 'Cold lemon iced tea.', 35.00, 'beverages', '/images/menu/coffee-menu.jpg'),
('Mineral Water', 'Bottled mineral water.', 25.00, 'beverages', '/images/menu/coffee-menu.jpg');

UPDATE menu_items SET stock = 20 WHERE stock = 0;
