class Item < ApplicationRecord
  belongs_to :product_type

  validates :serial_number, presence: true, uniqueness: { scope: :product_type_id }, length: { maximum: 50 }

  # method to mark an item as sold

  def mark_as_sold
    update(sold: true)
  end
end
