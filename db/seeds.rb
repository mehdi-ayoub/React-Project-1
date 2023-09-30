# db/seeds.rb
Item.destroy_all
ProductType.delete_all

# Product Types data
product_type_names = [
  'Laptop', 'Smartphone', 'Headphones', 'Monitor', 'Keyboard',
  'Mouse', 'Tablet', 'Smartwatch', 'Camera', 'Printer',
  'Router', 'Hard Drive', 'Speaker', 'Charger', 'USB Cable'
]

product_type_descriptions = [
  'A high-end laptop', 'Latest 5G smartphone', 'Noise-cancelling headphones', '4K Ultra HD Monitor', 'Mechanical Keyboard',
  'Wireless Mouse', 'Latest tablet with high-resolution display', 'Smartwatch with fitness tracking', 'DSLR Camera', 'Wireless Printer',
  'High-speed router', '1TB Hard Drive', 'Bluetooth Speaker', 'Fast charging adapter', 'USB 3.0 Cable'
]

product_images = [
  'laptop.jpeg', 'smartphone.jpg', 'headphones.jpg', 'monitor.jpg', 'keyboard.jpg',
  'mouse.jpg', 'tablet.jpg', 'smartwatch.jpg', 'camera.jpg', 'printer.jpg',
  'router.jpg', 'harddrive.jpg', 'speaker.jpg', 'charger.jpg', 'usbcable.jpg'
]

# Seed product types
product_types = product_type_names.each_with_index.map do |name, index|
  ProductType.create!(
    name: name,
    description: product_type_descriptions[index],
    image: product_images[index]
  )
end

# Seed items for each product type
product_types.each do |product_type|
  5.times do
    Item.create!(
      product_type_id: product_type.id,
      serial_number: "#{product_type.name}-#{SecureRandom.hex(4)}",
      sold: [true, false].sample
    )
  end
end
