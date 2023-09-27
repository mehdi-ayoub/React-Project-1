class Api::V1::ProductTypesController < ApplicationController
  before_action :set_product_type, only: [:edit, :update, :destroy]

  def index
    @product_types = ProductType.all

    render json: @product_types
  end

  def new
    @product_type = ProductType.new
  end

  def create
    @product_type = ProductType.new(product_type_params)
    if @product_type.save
      redirect_to product_types_path, notice: 'Product Type created successfully'
    else
      render :new
    end
  end

  def edit
    # To render the edit form
  end

  def update
    if @product_type.update(product_type_params)
      redirect_to product_types_path, notice: 'Product Type updated successfully'
    else
      render :edit
    end
  end

  def destroy
    @product_type.destroy
    redirect_to product_types_path, notice: 'Product Type deleted successfully'
  end

  private

  def product_type_params
    params.require(:product_type).permit(:name, :description, :image)
  end

  def set_product_type
    @product_type = ProductType.find(params[:id])
  end
end
