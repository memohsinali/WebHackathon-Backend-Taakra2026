#!/usr/bin/env python3
"""
Comprehensive Test Script for Taakra Backend API
Tests all endpoints with proper authentication, error handling, and colored output
"""

import requests
import json
import time
from datetime import datetime, timedelta
from colorama import init, Fore, Style

# Initialize colorama for colored console output
init(autoreset=True)

# Configuration
BASE_URL = "http://localhost:5000"
ADMIN_EMAIL = "admin@taakra.com"
ADMIN_PASSWORD = "123456"

# Test data storage
test_data = {
    'admin_token': None,
    'admin_refresh_token': None,
    'user_token': None,
    'user_refresh_token': None,
    'user_id': None,
    'category_id': None,
    'competition_id': None,
    'registration_id': None,
    'test_user_email': None,
    'support_user_email': None,
}

# Test statistics
stats = {
    'passed': 0,
    'failed': 0,
    'total': 0
}

def print_header(text):
    """Print a formatted header"""
    print(f"\n{'='*80}")
    print(f"{Fore.CYAN}{Style.BRIGHT}{text.center(80)}")
    print(f"{'='*80}\n")

def print_test(test_name, status, status_code=None, response=None, error=None):
    """Print test results with colored output"""
    stats['total'] += 1

    if status == 'PASS':
        stats['passed'] += 1
        status_text = f"{Fore.GREEN}[PASS]{Style.RESET_ALL}"
    else:
        stats['failed'] += 1
        status_text = f"{Fore.RED}[FAIL]{Style.RESET_ALL}"

    print(f"{status_text} {test_name}")

    if status_code:
        print(f"  Status Code: {status_code}")

    if response:
        try:
            if isinstance(response, dict):
                print(f"  Response: {json.dumps(response, indent=2)[:200]}...")
            else:
                print(f"  Response: {str(response)[:200]}...")
        except:
            print(f"  Response: {str(response)[:200]}...")

    if error:
        print(f"  {Fore.RED}Error: {error}{Style.RESET_ALL}")

    print()

def make_request(method, endpoint, test_name, headers=None, data=None, params=None, expected_status=200, expect_fail=False):
    """Make HTTP request with error handling"""
    url = f"{BASE_URL}{endpoint}"

    try:
        if method == 'GET':
            response = requests.get(url, headers=headers, params=params)
        elif method == 'POST':
            response = requests.post(url, headers=headers, json=data)
        elif method == 'PUT':
            response = requests.put(url, headers=headers, json=data)
        elif method == 'DELETE':
            response = requests.delete(url, headers=headers)
        else:
            raise ValueError(f"Unsupported HTTP method: {method}")

        status_code = response.status_code

        try:
            response_data = response.json()
        except:
            response_data = response.text

        # Check if status code matches expected
        if expect_fail:
            # For tests that should fail (like 503 for disabled chatbot)
            if status_code >= 400:
                print_test(test_name, 'PASS', status_code, response_data)
                return response_data, status_code
            else:
                print_test(test_name, 'FAIL', status_code, response_data,
                          f"Expected failure status (>=400), got {status_code}")
                return response_data, status_code
        else:
            # Normal success tests
            if status_code == expected_status:
                print_test(test_name, 'PASS', status_code, response_data)
                return response_data, status_code
            else:
                print_test(test_name, 'FAIL', status_code, response_data,
                          f"Expected {expected_status}, got {status_code}")
                return response_data, status_code

    except requests.exceptions.ConnectionError as e:
        print_test(test_name, 'FAIL', None, None, f"Connection failed: {str(e)}")
        return None, None
    except Exception as e:
        print_test(test_name, 'FAIL', None, None, str(e))
        return None, None

def get_auth_headers(token):
    """Get authorization headers"""
    return {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }

# ============================================================================
# TEST FUNCTIONS
# ============================================================================

def test_health_check():
    """Test health check endpoint"""
    print_header("HEALTH CHECK")
    make_request('GET', '/health', 'Health Check')

def test_authentication():
    """Test all authentication endpoints"""
    print_header("AUTHENTICATION TESTS")

    # 1. Admin Login
    login_data = {
        'email': ADMIN_EMAIL,
        'password': ADMIN_PASSWORD
    }
    response, status = make_request('POST', '/api/auth/login', 'Admin Login', data=login_data)

    if response and status == 200:
        test_data['admin_token'] = response.get('data', {}).get('accessToken')
        test_data['admin_refresh_token'] = response.get('data', {}).get('refreshToken')

    # 2. User Signup
    timestamp = int(time.time())
    test_email = f"testuser_{timestamp}@test.com"
    test_data['test_user_email'] = test_email

    signup_data = {
        'name': f'Test User {timestamp}',
        'email': test_email,
        'password': 'TestPass123!',
        'phone': f'+1234567{timestamp % 10000:04d}'
    }
    response, status = make_request('POST', '/api/auth/signup', 'User Signup', data=signup_data, expected_status=201)

    if response and status == 201:
        test_data['user_token'] = response.get('data', {}).get('accessToken')
        test_data['user_refresh_token'] = response.get('data', {}).get('refreshToken')
        test_data['user_id'] = response.get('data', {}).get('user', {}).get('_id')

    # 3. User Login
    login_data = {
        'email': test_email,
        'password': 'TestPass123!'
    }
    response, status = make_request('POST', '/api/auth/login', 'User Login', data=login_data)

    if response and status == 200:
        test_data['user_token'] = response.get('data', {}).get('accessToken')
        test_data['user_refresh_token'] = response.get('data', {}).get('refreshToken')

    # 4. Get Current User (Me)
    if test_data['user_token']:
        headers = get_auth_headers(test_data['user_token'])
        make_request('GET', '/api/auth/me', 'Get Current User (Me)', headers=headers)

    # 5. Refresh Token
    if test_data['user_refresh_token']:
        refresh_data = {
            'refreshToken': test_data['user_refresh_token']
        }
        response, status = make_request('POST', '/api/auth/refresh', 'Refresh Token', data=refresh_data)

        if response and status == 200:
            test_data['user_token'] = response.get('data', {}).get('accessToken')

    # Note: Google OAuth has been removed from the backend

def test_categories():
    """Test category CRUD operations"""
    print_header("CATEGORY TESTS")

    # 1. Get All Categories (Public)
    make_request('GET', '/api/categories', 'Get All Categories')

    # 2. Create Category (Admin Only)
    if test_data['admin_token']:
        headers = get_auth_headers(test_data['admin_token'])
        timestamp = int(time.time())
        category_data = {
            'name': f'Test Category {timestamp}',
            'description': 'A test category for API testing',
            'icon': 'test-icon'
        }
        response, status = make_request('POST', '/api/categories', 'Create Category',
                                       headers=headers, data=category_data, expected_status=201)

        if response and status == 201:
            test_data['category_id'] = response.get('data', {}).get('_id')

    # 3. Get Single Category
    if test_data['category_id']:
        make_request('GET', f'/api/categories/{test_data["category_id"]}', 'Get Single Category')

    # 4. Update Category (Admin Only)
    if test_data['admin_token'] and test_data['category_id']:
        headers = get_auth_headers(test_data['admin_token'])
        update_data = {
            'name': f'Updated Category {int(time.time())}',
            'description': 'Updated description',
            'icon': 'updated-icon'
        }
        make_request('PUT', f'/api/categories/{test_data["category_id"]}',
                    'Update Category', headers=headers, data=update_data)

    # Note: Delete is tested in cleanup section

def test_competitions():
    """Test competition endpoints"""
    print_header("COMPETITION TESTS")

    # 1. Get All Competitions (with pagination, sorting, search)
    make_request('GET', '/api/competitions', 'Get All Competitions')

    # 2. Get Competitions with Pagination
    params = {'page': 1, 'limit': 10}
    make_request('GET', '/api/competitions', 'Get Competitions (Paginated)', params=params)

    # 3. Get Competitions with Sorting
    params = {'sort': '-registrationDeadline'}
    make_request('GET', '/api/competitions', 'Get Competitions (Sorted by Deadline)', params=params)

    # 4. Search Competitions
    params = {'search': 'test'}
    make_request('GET', '/api/competitions', 'Search Competitions', params=params)

    # 5. Filter by Category
    if test_data['category_id']:
        params = {'category': test_data['category_id']}
        make_request('GET', '/api/competitions', 'Filter Competitions by Category', params=params)

    # 6. Get Calendar View
    make_request('GET', '/api/competitions/calendar', 'Get Competitions Calendar')

    # 7. Create Competition (Admin Only)
    if test_data['admin_token'] and test_data['category_id']:
        headers = get_auth_headers(test_data['admin_token'])
        timestamp = int(time.time())

        # Future dates for the competition - use timedelta to properly add days
        start_date = datetime.now() + timedelta(days=10)
        end_date = datetime.now() + timedelta(days=10, hours=3)

        competition_data = {
            'title': f'Test Competition {timestamp}',
            'description': 'A comprehensive test competition',
            'category': test_data['category_id'],
            'venue': 'Test Venue',
            'building': 'Test Building',
            'startDate': start_date.isoformat(),
            'endDate': end_date.isoformat(),
            'dayNumber': 1
        }
        response, status = make_request('POST', '/api/competitions', 'Create Competition',
                                       headers=headers, data=competition_data, expected_status=201)

        if response and status == 201:
            test_data['competition_id'] = response.get('data', {}).get('_id')

    # 8. Get Single Competition
    if test_data['competition_id']:
        make_request('GET', f'/api/competitions/{test_data["competition_id"]}',
                    'Get Single Competition')

    # 9. Update Competition (Admin Only)
    if test_data['admin_token'] and test_data['competition_id']:
        headers = get_auth_headers(test_data['admin_token'])

        # Future dates for the competition - use timedelta to properly add days
        start_date = datetime.now() + timedelta(days=15)
        end_date = datetime.now() + timedelta(days=15, hours=4)

        update_data = {
            'title': f'Updated Competition {int(time.time())}',
            'description': 'Updated description',
            'category': test_data['category_id'],
            'venue': 'Updated Venue',
            'building': 'Updated Building',
            'startDate': start_date.isoformat(),
            'endDate': end_date.isoformat(),
            'dayNumber': 2
        }
        make_request('PUT', f'/api/competitions/{test_data["competition_id"]}',
                    'Update Competition', headers=headers, data=update_data)

    # Note: Delete is tested in cleanup section

def test_registrations():
    """Test registration endpoints"""
    print_header("REGISTRATION TESTS")

    # 1. Create Registration (User)
    if test_data['user_token'] and test_data['competition_id']:
        headers = get_auth_headers(test_data['user_token'])
        registration_data = {
            'competition': test_data['competition_id'],
            'teamName': 'Test Team',
            'members': [
                {'name': 'Member 1', 'email': 'member1@test.com', 'phone': '+1234567890'},
                {'name': 'Member 2', 'email': 'member2@test.com', 'phone': '+1234567891'}
            ]
        }
        response, status = make_request('POST', '/api/registrations', 'Create Registration',
                                       headers=headers, data=registration_data, expected_status=201)

        if response and status == 201:
            test_data['registration_id'] = response.get('data', {}).get('_id')

    # 2. Get My Registrations (User)
    if test_data['user_token']:
        headers = get_auth_headers(test_data['user_token'])
        make_request('GET', '/api/registrations/my', 'Get My Registrations', headers=headers)

    # 3. Get All Registrations (Admin/Support)
    if test_data['admin_token']:
        headers = get_auth_headers(test_data['admin_token'])
        make_request('GET', '/api/registrations', 'Get All Registrations (Admin)', headers=headers)

    # 4. Approve Registration (Admin)
    if test_data['admin_token'] and test_data['registration_id']:
        headers = get_auth_headers(test_data['admin_token'])
        make_request('PUT', f'/api/registrations/{test_data["registration_id"]}/approve',
                    'Approve Registration', headers=headers)

    # Note: Delete is tested in cleanup section

def test_admin_endpoints():
    """Test admin-only endpoints"""
    print_header("ADMIN ENDPOINTS TESTS")

    if not test_data['admin_token']:
        print(f"{Fore.YELLOW}Skipping admin tests - no admin token available{Style.RESET_ALL}")
        return

    headers = get_auth_headers(test_data['admin_token'])

    # 1. Get Stats
    make_request('GET', '/api/admin/stats', 'Get Admin Stats', headers=headers)

    # 2. Get All Users
    make_request('GET', '/api/admin/users', 'Get All Users', headers=headers)

    # 3. Add Support Member (First create a user, then promote to support)
    timestamp = int(time.time())
    support_email = f"support_{timestamp}@test.com"
    test_data['support_user_email'] = support_email

    # First create the user via signup
    new_user_data = {
        'name': f'Support User {timestamp}',
        'email': support_email,
        'password': '123456'
    }
    make_request('POST', '/api/auth/signup', 'Create User for Support Role',
                data=new_user_data, expected_status=201)

    # Then promote the user to support
    support_data = {
        'email': support_email
    }
    make_request('POST', '/api/admin/support', 'Add Support Member',
                headers=headers, data=support_data, expected_status=200)

def test_chat_endpoints():
    """Test chat endpoints"""
    print_header("CHAT ENDPOINTS TESTS")

    if not test_data['user_token']:
        print(f"{Fore.YELLOW}Skipping chat tests - no user token available{Style.RESET_ALL}")
        return

    headers = get_auth_headers(test_data['user_token'])

    # 1. Get Conversations
    make_request('GET', '/api/chat/conversations', 'Get Conversations', headers=headers)

    # 2. Get Chat History with Another User
    if test_data['user_id']:
        make_request('GET', f'/api/chat/{test_data["user_id"]}',
                    'Get Chat History', headers=headers)

def test_chatbot_endpoint():
    """Test chatbot endpoint (should return 503 - disabled)"""
    print_header("CHATBOT ENDPOINT TEST")

    if not test_data['user_token']:
        print(f"{Fore.YELLOW}Skipping chatbot test - no user token available{Style.RESET_ALL}")
        return

    headers = get_auth_headers(test_data['user_token'])

    # Chatbot is disabled, should return 503
    chatbot_data = {
        'message': 'Hello chatbot!'
    }
    response, status = make_request('POST', '/api/chatbot', 'Chatbot Query (Disabled - Expect 503)',
                                   headers=headers, data=chatbot_data,
                                   expected_status=503, expect_fail=True)

def test_authorization():
    """Test authorization (non-admin trying admin endpoints)"""
    print_header("AUTHORIZATION TESTS")

    if not test_data['user_token']:
        print(f"{Fore.YELLOW}Skipping authorization tests - no user token available{Style.RESET_ALL}")
        return

    headers = get_auth_headers(test_data['user_token'])

    # 1. User trying to create category (should fail)
    category_data = {
        'name': 'Unauthorized Category',
        'description': 'This should fail',
        'icon': 'fail-icon'
    }
    response, status = make_request('POST', '/api/categories',
                                   'User Creating Category (Should Fail)',
                                   headers=headers, data=category_data,
                                   expected_status=403, expect_fail=True)

    # 2. User trying to access admin stats (should fail)
    response, status = make_request('GET', '/api/admin/stats',
                                   'User Accessing Admin Stats (Should Fail)',
                                   headers=headers,
                                   expected_status=403, expect_fail=True)

def cleanup_test_data():
    """Clean up test data"""
    print_header("CLEANUP TEST DATA")

    if not test_data['admin_token']:
        print(f"{Fore.YELLOW}Skipping cleanup - no admin token available{Style.RESET_ALL}")
        return

    headers = get_auth_headers(test_data['admin_token'])

    # 1. Delete Registration
    if test_data['registration_id']:
        make_request('DELETE', f'/api/registrations/{test_data["registration_id"]}',
                    'Delete Test Registration', headers=headers)

    # 2. Delete Competition
    if test_data['competition_id']:
        make_request('DELETE', f'/api/competitions/{test_data["competition_id"]}',
                    'Delete Test Competition', headers=headers)

    # 3. Delete Category
    if test_data['category_id']:
        make_request('DELETE', f'/api/categories/{test_data["category_id"]}',
                    'Delete Test Category', headers=headers)

    print(f"\n{Fore.YELLOW}Note: Test users (testuser_* and support_*) remain in database.{Style.RESET_ALL}")
    print(f"{Fore.YELLOW}They can be manually removed from the database if needed.{Style.RESET_ALL}")

def print_summary():
    """Print test summary"""
    print_header("TEST SUMMARY")

    total = stats['total']
    passed = stats['passed']
    failed = stats['failed']
    pass_rate = (passed / total * 100) if total > 0 else 0

    print(f"Total Tests: {total}")
    print(f"{Fore.GREEN}Passed: {passed}{Style.RESET_ALL}")
    print(f"{Fore.RED}Failed: {failed}{Style.RESET_ALL}")
    print(f"\nPass Rate: {Fore.CYAN}{pass_rate:.2f}%{Style.RESET_ALL}")

    if failed == 0:
        print(f"\n{Fore.GREEN}{Style.BRIGHT}ALL TESTS PASSED!{Style.RESET_ALL}")
    else:
        print(f"\n{Fore.YELLOW}Some tests failed. Please review the output above.{Style.RESET_ALL}")

    print("\n" + "="*80 + "\n")

# ============================================================================
# MAIN EXECUTION
# ============================================================================

def main():
    """Main test execution"""
    print(f"\n{Fore.CYAN}{Style.BRIGHT}")
    print("╔" + "="*78 + "╗")
    print("║" + "TAAKRA BACKEND API - COMPREHENSIVE TEST SUITE".center(78) + "║")
    print("║" + f"Base URL: {BASE_URL}".center(78) + "║")
    print("║" + f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}".center(78) + "║")
    print("╚" + "="*78 + "╝")
    print(Style.RESET_ALL)

    try:
        # Run all tests in order
        test_health_check()
        test_authentication()
        test_categories()
        test_competitions()
        test_registrations()
        test_admin_endpoints()
        test_chat_endpoints()
        test_chatbot_endpoint()
        test_authorization()

        # Cleanup
        cleanup_test_data()

        # Print summary
        print_summary()

    except KeyboardInterrupt:
        print(f"\n\n{Fore.YELLOW}Test execution interrupted by user{Style.RESET_ALL}")
        print_summary()
    except Exception as e:
        print(f"\n\n{Fore.RED}Unexpected error during test execution: {str(e)}{Style.RESET_ALL}")
        print_summary()

if __name__ == '__main__':
    main()
