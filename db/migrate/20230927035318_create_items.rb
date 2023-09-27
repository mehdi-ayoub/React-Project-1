class CreateItems < ActiveRecord::Migration[7.0]
  def change
    create_table :items do |t|
      t.references :product_type, null: false, foreign_key: true
      t.string :serial_number
      t.boolean :sold, default: false

      t.timestamps
    end
  end
end
