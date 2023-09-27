class Api::V1::ProductTypesController < ApplicationController
  before_action :set_product_type, only: [:show, :update, :destroy]

  # List all product types
  def index
    @product_types = ProductType.all.includes(:items).map do |pt|
      {
        id: pt.id,
        name: pt.name,
        items_count: pt.items.count # This line calculates the total count for each ProductType's items
      }
    end
    render json: @product_types
  end

  # Show a specific product type
  def show
    render json: @product_type
  end

  # Create a new product type
  def create
    @product_type = ProductType.new(product_type_params)

    if @product_type.save
      render json: { message: 'Product Type created successfully', product_type: @product_type }, status: :created
    else
      render json: { errors: @product_type.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # Update a specific product type
  def update
    if @product_type.update(product_type_params)
      render json: { message: 'Product Type updated successfully', product_type: @product_type }, status: :ok
    else
      render json: { errors: @product_type.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # Delete a specific product type
  def destroy
    if @product_type.destroy
      render json: { message: 'Product Type deleted successfully' }, status: :ok
    else
      render json: { errors: "Failed to delete the product type" }, status: :unprocessable_entity
    end
  end

  private

  def product_type_params
    params.require(:product_type).permit(:name, :description, :image)
  end

  def set_product_type
    @product_type = ProductType.find(params[:id])
  end
end
