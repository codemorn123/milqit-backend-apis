#!/bin/bash

# Admin Delivery Boy Management API Test Script
# This script tests all admin delivery boy management endpoints

BASE_URL="http://localhost:5001/v1"
ADMIN_TOKEN="YOUR_ADMIN_TOKEN_HERE"  # Replace with actual admin token

echo "🔧 Testing Admin Delivery Boy Management APIs"
echo "=============================================="
echo "⚠️  Make sure to replace ADMIN_TOKEN in the script"
echo ""

# Test 1: Get Statistics
echo -e "\n📊 Test 1: Get Delivery Boy Statistics"
echo "---------------------------------------"
curl -s -X GET "$BASE_URL/admin/delivery-boys/stats" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.'

sleep 2

# Test 2: Create Delivery Boy
echo -e "\n➕ Test 2: Create New Delivery Boy"
echo "-----------------------------------"
CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/admin/delivery-boys" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin Created Delivery Boy",
    "phone": "+919999999999",
    "email": "admincreated@example.com",
    "vehicleType": "scooter",
    "vehicleNumber": "KA03XY7890",
    "deliveryZone": ["Bangalore South"],
    "isActive": true
  }')

echo "$CREATE_RESPONSE" | jq '.'

# Extract delivery boy ID
DELIVERY_BOY_ID=$(echo "$CREATE_RESPONSE" | jq -r '.data.id')
echo "Created Delivery Boy ID: $DELIVERY_BOY_ID"

sleep 2

# Test 3: Get Delivery Boys List
echo -e "\n📋 Test 3: Get Delivery Boys List (Paginated)"
echo "----------------------------------------------"
curl -s -X GET "$BASE_URL/admin/delivery-boys?page=1&limit=5&sortBy=createdAt&sortOrder=desc" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.'

sleep 2

# Test 4: Search Delivery Boys
echo -e "\n🔍 Test 4: Search Delivery Boys"
echo "--------------------------------"
curl -s -X GET "$BASE_URL/admin/delivery-boys?search=delivery" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.'

sleep 2

# Test 5: Filter by Vehicle Type
echo -e "\n🚲 Test 5: Filter by Vehicle Type (bike)"
echo "-----------------------------------------"
curl -s -X GET "$BASE_URL/admin/delivery-boys?vehicleType=bike&isActive=true" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.'

sleep 2

# Test 6: Get Specific Delivery Boy
echo -e "\n👤 Test 6: Get Delivery Boy Details"
echo "------------------------------------"
curl -s -X GET "$BASE_URL/admin/delivery-boys/$DELIVERY_BOY_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.'

sleep 2

# Test 7: Update Delivery Boy
echo -e "\n✏️  Test 7: Update Delivery Boy"
echo "--------------------------------"
curl -s -X PUT "$BASE_URL/admin/delivery-boys/$DELIVERY_BOY_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Admin Created DB",
    "deliveryZone": ["Bangalore South", "Bangalore Central"],
    "vehicleType": "bike"
  }' | jq '.'

sleep 2

# Test 8: Verify Documents
echo -e "\n✅ Test 8: Verify Documents"
echo "---------------------------"
curl -s -X PUT "$BASE_URL/admin/delivery-boys/$DELIVERY_BOY_ID/verify-documents" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "isDocumentVerified": true,
    "isBackgroundCheckDone": true,
    "verificationNotes": "All documents verified and authentic"
  }' | jq '.'

sleep 2

# Test 9: Assign Zones
echo -e "\n📍 Test 9: Assign Delivery Zones"
echo "---------------------------------"
curl -s -X PUT "$BASE_URL/admin/delivery-boys/$DELIVERY_BOY_ID/assign-zones" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "deliveryZone": ["Bangalore North", "Bangalore East", "Bangalore West"]
  }' | jq '.'

sleep 2

# Test 10: Toggle Status (Activate)
echo -e "\n🟢 Test 10: Activate Delivery Boy"
echo "----------------------------------"
curl -s -X PUT "$BASE_URL/admin/delivery-boys/$DELIVERY_BOY_ID/status" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "isActive": true,
    "reason": "Verification completed successfully"
  }' | jq '.'

sleep 2

# Test 11: Get Performance
echo -e "\n📈 Test 11: Get Performance Metrics"
echo "------------------------------------"
curl -s -X GET "$BASE_URL/admin/delivery-boys/$DELIVERY_BOY_ID/performance" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.'

sleep 2

# Test 12: Get Available Delivery Boys
echo -e "\n🚀 Test 12: Get Available Delivery Boys"
echo "----------------------------------------"
curl -s -X GET "$BASE_URL/admin/delivery-boys/available/list?zone=Bangalore%20North" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.'

sleep 2

# Test 13: Toggle Status (Deactivate)
echo -e "\n🔴 Test 13: Deactivate Delivery Boy"
echo "------------------------------------"
curl -s -X PUT "$BASE_URL/admin/delivery-boys/$DELIVERY_BOY_ID/status" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "isActive": false,
    "reason": "Test deactivation"
  }' | jq '.'

sleep 2

# Test 14: Bulk Operation (Activate)
echo -e "\n🔄 Test 14: Bulk Activate Operation"
echo "------------------------------------"
curl -s -X POST "$BASE_URL/admin/delivery-boys/bulk-operation" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"deliveryBoyIds\": [\"$DELIVERY_BOY_ID\"],
    \"operation\": \"activate\",
    \"reason\": \"Bulk activation test\"
  }" | jq '.'

sleep 2

# Test 15: Filter by Status
echo -e "\n🔍 Test 15: Filter Active Delivery Boys"
echo "----------------------------------------"
curl -s -X GET "$BASE_URL/admin/delivery-boys?isActive=true&limit=10" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.'

sleep 2

# Test 16: Sort by Rating
echo -e "\n⭐ Test 16: Sort by Average Rating"
echo "-----------------------------------"
curl -s -X GET "$BASE_URL/admin/delivery-boys?sortBy=averageRating&sortOrder=desc&limit=5" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.'

sleep 2

# Test 17: Delete Delivery Boy
echo -e "\n🗑️  Test 17: Delete Delivery Boy"
echo "---------------------------------"
curl -s -X DELETE "$BASE_URL/admin/delivery-boys/$DELIVERY_BOY_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.'

sleep 2

# Test 18: Get Updated Statistics
echo -e "\n📊 Test 18: Get Updated Statistics"
echo "-----------------------------------"
curl -s -X GET "$BASE_URL/admin/delivery-boys/stats" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.'

echo -e "\n✅ All admin tests completed!"
echo "============================="
echo ""
echo "📝 Note: Remember to:"
echo "   1. Replace ADMIN_TOKEN with your actual admin token"
echo "   2. Ensure the server is running on port 5001"
echo "   3. Install jq for formatted JSON output (brew install jq)"
echo ""
