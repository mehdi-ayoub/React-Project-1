class ProductType < ApplicationRecord
  has_many :items

  # validations

  validates :name, presence: true, length: { maximum: 15 }
  validates :description, length: { maximum: 50 }

  # to retrieve all the items associated with a specific product type
  def items_count
    items.count
  end

end
