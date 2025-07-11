#!/bin/bash

echo "🧪 Testing Shopoo Navigation & Authentication"
echo "============================================="

BASE_URL="http://localhost:3000"

# Test 1: Home page (anonymous)
echo -n "✅ Home page (anonymous): "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/)
if [ $STATUS -eq 200 ]; then
    echo "OK ($STATUS)"
else
    echo "FAIL ($STATUS)"
fi

# Test 2: Login page
echo -n "✅ Login page: "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/auth/login)
if [ $STATUS -eq 200 ]; then
    echo "OK ($STATUS)"
else
    echo "FAIL ($STATUS)"
fi

# Test 3: Register page
echo -n "✅ Register page: "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/auth/register)
if [ $STATUS -eq 200 ]; then
    echo "OK ($STATUS)"
else
    echo "FAIL ($STATUS)"
fi

# Test 4: Customer login + dashboard
echo -n "✅ Customer login: "
CUSTOMER_LOGIN=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer1@shopoo.com","password":"customer123"}' \
  -c customer_test.txt)

if echo $CUSTOMER_LOGIN | grep -q "success.*true"; then
    echo "OK"
    
    echo -n "✅ Customer dashboard access: "
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" -b customer_test.txt $BASE_URL/dashboard/customer)
    if [ $STATUS -eq 200 ]; then
        echo "OK ($STATUS)"
    else
        echo "FAIL ($STATUS)"
    fi
    
    echo -n "✅ Customer logout: "
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" -b customer_test.txt $BASE_URL/auth/logout)
    if [ $STATUS -eq 302 ]; then
        echo "OK ($STATUS)"
    else
        echo "FAIL ($STATUS)"
    fi
else
    echo "FAIL"
fi

# Test 5: Admin login + dashboard  
echo -n "✅ Admin login: "
ADMIN_LOGIN=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@shopoo.com","password":"admin123"}' \
  -c admin_test.txt)

if echo $ADMIN_LOGIN | grep -q "success.*true"; then
    echo "OK"
    
    echo -n "✅ Admin dashboard access: "
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" -b admin_test.txt $BASE_URL/dashboard/admin)
    if [ $STATUS -eq 200 ]; then
        echo "OK ($STATUS)"
    else
        echo "FAIL ($STATUS)"
    fi
    
    echo -n "✅ Admin logout: "
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" -b admin_test.txt $BASE_URL/auth/logout)
    if [ $STATUS -eq 302 ]; then
        echo "OK ($STATUS)"
    else
        echo "FAIL ($STATUS)"
    fi
else
    echo "FAIL"
fi

# Test 6: Shop login + dashboard
echo -n "✅ Shop login: "
SHOP_LOGIN=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"shop1@gmail.com","password":"shop123"}' \
  -c shop_test.txt)

if echo $SHOP_LOGIN | grep -q "success.*true"; then
    echo "OK"
    
    echo -n "✅ Shop dashboard access: "
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" -b shop_test.txt $BASE_URL/dashboard/shop)
    if [ $STATUS -eq 200 ]; then
        echo "OK ($STATUS)"
    else
        echo "FAIL ($STATUS)"
    fi
    
    echo -n "✅ Shop logout: "
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" -b shop_test.txt $BASE_URL/auth/logout)
    if [ $STATUS -eq 302 ]; then
        echo "OK ($STATUS)"
    else
        echo "FAIL ($STATUS)"
    fi
else
    echo "FAIL"
fi

# Test 7: Protected routes without auth
echo -n "✅ Dashboard without auth (should redirect): "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/dashboard)
if [ $STATUS -eq 302 ]; then
    echo "OK ($STATUS)"
else
    echo "FAIL ($STATUS)"
fi

echo ""
echo "🧹 Cleaning up test cookies..."
rm -f customer_test.txt admin_test.txt shop_test.txt

echo "✅ All navigation tests completed!"
