class Api::V1::ProductTypesController < ApplicationController
  before_action :set_product_type, only: [:show, :update, :destroy]
  skip_before_action :verify_authenticity_token

  def index
    @product_types = ProductType.all.includes(:items).map do |pt|
      {
        id: pt.id,
        name: pt.name,
        items_count: pt.items.where(sold: false).count,
        description: pt.description
      }
    end
    render json: @product_types
  end

  def show
    render json: @product_type
  end

  def create
    puts params
    @product_type = ProductType.new(product_type_params)

    if @product_type.save
      render json: { message: 'Product Type created successfully', product_type: @product_type }, status: :created
    else
      render json: { errors: @product_type.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    puts "Received parameters: #{params.inspect}"
    if @product_type.update(product_type_params)
      render json: @product_type
    else
      render json: { errors: @product_type.errors.full_messages }, status: :unprocessable_entity
    end
  end

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
