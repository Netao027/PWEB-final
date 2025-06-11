from flask import Flask, jsonify, request, abort
import json
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
DATA_FILE = 'products.json'

# Load products from file
def load_products():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return []

# Save products to file
def save_products(products):
    with open(DATA_FILE, 'w') as f:
        json.dump(products, f, indent=2)

# Load initial data
products = load_products()

# GET all products
@app.route('/api/products', methods=['GET'])
def get_products():
    return jsonify({'products': products})

# GET a single product
@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = next((p for p in products if p['id'] == product_id), None)
    if not product:
        abort(404)
    return jsonify(product)

# POST a new product
@app.route('/api/products', methods=['POST'])
def create_product():
    if not request.json or 'name' not in request.json:
        abort(400, 'Missing name field')

    new_id = max((p['id'] for p in products), default=0) + 1
    product = {
        'id': new_id,
        'name': request.json['name'],
        'description': request.json.get('description', ''),
        'price': float(request.json.get('price', 0.0)),
        'image': request.json.get('image', '')
    }
    products.append(product)
    save_products(products)
    return jsonify(product), 201

# PUT update a product
@app.route('/api/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    product = next((p for p in products if p['id'] == product_id), None)
    if not product:
        abort(404)

    data = request.json
    product['name'] = data.get('name', product['name'])
    product['description'] = data.get('description', product['description'])
    product['price'] = float(data.get('price', product['price']))
    product['image'] = data.get('image', product['image'])

    save_products(products)
    return jsonify(product)

# DELETE a product
@app.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    global products
    updated = [p for p in products if p['id'] != product_id]
    if len(updated) == len(products):
        abort(404)

    products = updated
    save_products(products)
    return jsonify({'result': True})

if __name__ == '__main__':
    app.run(debug=True)
