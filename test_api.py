import requests
import json
import random

username = f'testuser_{random.randint(1000,9999)}'
# 1. Register to user_service
reg_res = requests.post('http://127.0.0.1:8002/api/register/', json={
    'username': username,
    'password': 'password123',
    'email': f'{username}@test.com',
    'salary': 5000,
    'role': 'borrower'
})
print("Register:", reg_res.status_code, reg_res.text)

if reg_res.status_code == 201:
    token = reg_res.json()['access']
    
    # 2. Access credisure active_loan API
    res = requests.get('http://127.0.0.1:8000/api/loans/borrower/active_loan/', headers={
        'Authorization': f'Bearer {token}'
    })
    print("Active Loan:", res.status_code, res.text)
