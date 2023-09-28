class ProductType < ApplicationRecord
  has_many :items, dependent: :destroy

  has_many :available_items, -> { where(sold: false) }, class_name: 'Item'

  # validations

  validates :name, presence: true, length: { maximum: 50 }
  validates :description, length: { maximum: 50 }

  # to retrieve all the items associated with a specific product type
  def items_count
    items.count
  end
end
