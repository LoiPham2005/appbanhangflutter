export const en = {
    translation: {
        // Common texts
        common: {
            settings: 'Settings',
            language: {
                vietnamese: 'Vietnamese',
                english: 'English',
                title: 'Language'
            },
            error: 'Error',
            cancel: 'Cancel',
            confirm: 'Confirm',
            save: 'Save',
            success: 'Success',
            loading: 'Processing...',
            back: 'Back'
        },

        // Welcome screen
        welcome: {
            title: 'Welcome to GemStore!',
            subtitle: 'A Home for Book Lovers',
            startButton: 'Get Started'
        },

        // Introduce screen
        introduce: {
            skip: 'Skip',
            getStarted: 'Get Started',
            slide1: {
                title: 'World of Books at Your Fingertips',
                subtitle: 'Thousands of books from different genres'
            },
            slide2: {
                title: 'Connect with People',
                subtitle: 'Share your reading interests'
            },
            slide3: {
                title: 'Easy Shopping',
                subtitle: 'Shop anytime, anywhere with GemStore app'
            }
        },

        // Authentication screens
        auth: {
            login: {
                title: 'Login to Your Account',
                email: 'Email address',
                password: 'Password',
                forgotPassword: 'Forgot Password',
                loginButton: 'LOGIN',
                noAccount: "Don't have an account?",
                register: 'Register',
                loggingIn: 'Logging in...',
                failed: 'Login failed',
                error: 'An error occurred during login',
                loginRequired: 'Please log in to continue'
            },
            register: {
                title: 'Create Your Account',
                name: 'Enter your name',
                email: 'Email address',
                password: 'Password',
                confirmPassword: 'Confirm password',
                registerButton: 'REGISTER',
                haveAccount: 'Already have an account?',
                login: 'Login',
                registering: 'Registering...',
                success: 'Account registration successful',
                failed: 'Registration failed',
                error: 'An error occurred during registration'
            },
            forgotPassword: {
                title: 'Forgot Password',
                description: 'Enter your email to receive verification code',
                email: 'Email address',
                sendCode: 'Send verification code',
                sending: 'Sending code...',
                enterOTP: {
                    title: 'Enter OTP',
                    description: 'Enter the OTP sent to your email',
                    timeLeft: 'Time remaining: ',
                    resend: 'Resend code',
                    confirm: 'Confirm',
                    processing: 'Processing...'
                },
                changePassword: {
                    title: 'Change Password',
                    newPassword: 'New password',
                    confirmPassword: 'Confirm new password',
                    submit: 'Change password',
                    success: 'Password changed successfully',
                    processing: 'Processing...',
                    error: 'Unable to change password'
                },
                errors: {
                    invalidEmail: 'Please enter a valid email',
                    invalidOTP: 'Invalid OTP',
                    emailNotExist: 'Email does not exist',
                    passwordNotMatch: 'Passwords do not match',
                    passwordTooShort: 'Password must be at least 6 characters'
                }
            }
        },

        // Validation messages
        validation: {
            required: 'This field is required',
            emptyName: 'Please enter name',
            emptyEmail: 'Please enter email',
            invalidEmail: 'Invalid email format',
            emptyPassword: 'Please enter password',
            passwordLength: 'Password must be at least 6 characters',
            emptyConfirmPassword: 'Please confirm password',
            passwordMismatch: 'Passwords do not match'
        },

        // Drawer menu
        drawer: {
            home: 'Home',
            cart: 'Cart',
            orders: 'Orders',
            profile: 'Profile',
            accountManagement: 'Account Management',
            orderManagement: 'Order Management',
            productManagement: 'Product Management',
            statistics: 'Revenue Statistics',
            other: 'Other',
            settings: 'Settings',
            support: 'Support',
            aboutUs: 'About Us',
            exit: 'Exit',
            logout: 'Logout',
            mode: 'Mode',
            lightMode: 'Light',
            darkMode: {
                title: 'Dark Mode',
                light: 'Light',
                dark: 'Dark'
            },
            language: 'Language',
            logoutConfirmMessage: 'Are you sure you want to logout?',
            logoutError: 'Error occurred during logout'
        },

        // Home screen
        home: {
            bestsellers: 'Bestsellers',
            onSale: 'On Sale',
            goldenDeals: 'Golden Deals',
            featured: 'Featured Products',
            viewAll: 'View All'
        },

        // Search screen  
        search: {
            title: 'Search',
            placeholder: 'Enter search keywords...',
            searching: 'Searching...',
            noResults: 'No results found',
            searchButton: 'Search',
            searchHistory: 'Search History',
            clearHistory: 'Clear History'
        },

        // Product management
        productManagement: {
            title: 'Product Management',
            products: 'Products',
            inventory: 'Inventory',
            returns: 'Returns',
            addNew: 'Add New Product',
            cancel: 'Cancel',
            details: 'View Details',
            edit: 'Edit',
            delete: 'Delete',
            chooseVideo: 'Choose Video',
            videoSelected: 'Video selected',
            add: {
                title: 'Add New Product',
                productName: 'Product name',
                author: 'Author',
                price: 'Price',
                quantity: 'Quantity',
                category: 'Category',
                description: 'Description',
                chooseImage: 'Choose image',
                chooseVideo: 'Choose video',
                submit: 'Add Product'
            },
            edit: {
                title: 'Edit Product',
                save: 'Save Changes'
            },
            delete: {
                title: 'Delete Product',
                confirm: 'Are you sure you want to delete this product?',
                success: 'Product deleted successfully'
            },
            product: {
                title: 'Product',
                emptyText: 'No products',
                details: {
                    name: 'Product name',
                    author: 'Author',
                    price: 'Price',
                    quantity: 'Quantity'
                },
                actions: {
                    view: 'View Details',
                    edit: 'Edit',
                    delete: 'Delete',
                    confirm: 'Confirm',
                    cancel: 'Cancel'
                },
                messages: {
                    deleteConfirm: 'Are you sure you want to delete this product?',
                    deleteSuccess: 'Product deleted successfully',
                    deleteError: 'Unable to delete product'
                }
            },
            addProduct: {
                title: 'Add New Product',
                permissionDenied: 'No permission to access photo library',
                errorSelectingImage: 'Error selecting image',
                errorSelectingVideo: 'Error selecting video',
                fillAllFields: 'Please fill in all fields',
                confirm: 'Confirm',
                confirmMessage: 'Are you sure you want to add this product?',
                success: 'Product added successfully',
                error: 'Error occurred while adding product',
                uploadingMedia: 'Uploading...',
                deleteMedia: {
                    title: 'Confirm deletion',
                    message: 'Are you sure you want to delete this media?',
                    cancel: 'Cancel',
                    confirm: 'Delete'
                }
            },
            editProduct: {
                title: 'Edit Product',
                permissionDenied: 'No permission to access photo library',
                errorSelectingImage: 'Error selecting image',
                errorSelectingVideo: 'Error selecting video',
                fillAllFields: 'Please fill in all fields',
                confirmTitle: 'Confirm edit',
                confirmMessage: 'Are you sure you want to save changes?',
                success: 'Product updated successfully',
                error: 'Error occurred while updating product',
                uploading: 'Updating...'
            },
            tabProducts: {
                noProducts: 'No products',
                deleteConfirm: 'Are you sure you want to delete this product?',
                deleteSuccess: 'Product deleted successfully',
                deleteError: 'Unable to delete product',
                deleting: 'Deleting...',
                askdelete: 'Confirm deletion'
            }
        },

        // Product form fields
        product: {
            name: 'Product name',
            author: 'Author',
            price: 'Price',
            quantity: 'Quantity',
            description: 'Description',
            status: 'Status',
            active: 'Active',
            outOfStock: 'Out of Stock',
            stopSelling: 'Stop Selling',
            importing: 'Importing'
        },

        inventory: {
            title: 'Inventory',
            emptyText: 'No products',
            status: {
                active: 'In Stock',
                outOfStock: 'Out of Stock',
                importing: 'Importing',
                stopSelling: 'Stop Selling'
            }
        },

        // Product detail
        productDetail: {
            addToCart: 'Add to Cart',
            author: 'Author',
            quantity: 'Quantity',
            category: 'Category',
            description: 'Description',
            status: {
                active: 'In Stock',
                'out of stock': 'Out of Stock',
                'importing goods': 'Importing',
                'stop selling': 'Stop Selling'
            },
            confirm: 'Confirm',
            askCart: 'Do you want to add this product to cart?',
            videoPlaybackError: 'Unable to play video'
        },

        // Cart screen
        cart: {
            confirmDelete: 'Are you sure you want to remove this product from cart?',
            yes: 'Yes',
            no: 'No',
            addSuccess: 'Added to cart',
            addError: 'Unable to add to cart',
            loginRequired: 'Please login to add to cart',
            continueShopping: 'Continue Shopping',
            viewCart: 'View Cart',
            adding: 'Adding to cart...',
            productNotAvailable: 'This product is currently unavailable',
            total: 'Total',
            updateError: 'Unable to update quantity',
            quantity: 'Quantity',
            buy: 'Buy',
            selectItemsToBuy: 'Please select items to buy'
        },

        // Order screen
        order: {
            title: 'Checkout',
            deliveryAddress: 'Delivery Address',
            enterAddress: 'Enter delivery address',
            selectedItems: 'Selected Items',
            voucher: 'Voucher',
            enterVoucher: 'Enter voucher code',
            apply: 'Apply',
            paymentMethod: 'Payment Method',
            cod: 'Cash on Delivery',
            subtotal: 'Subtotal',
            shippingFee: 'Shipping Fee',
            discount: 'Discount',
            total: 'Total',
            placeOrder: 'Place Order'
        },

        // Profile screen
        profile: {
            personalInfo: 'Personal Information',
            orders: 'My Orders',
            settings: 'Settings',
            help: 'Help',
            address1: 'Address',
            paymentMethod: 'Payment Method',
            voucher: 'Vouchers',
            wishlist: 'Wishlist',
            appReviews: 'App Reviews',
            username: 'Username',
            sex: 'Gender',
            male: 'Male',
            female: 'Female',
            other: 'Other',
            phone: 'Phone',
            birthDate: 'Birth Date',
            save: 'Save Changes',
            updating: 'Updating...',
            updateSuccess: 'Information updated successfully',
            updateError: 'Unable to update information',
            permissionDenied: 'Photo library access permission required',
            title: 'Profile',
            editProfile: {
                title: 'Edit Profile',
                personalInfo: 'Personal Information',
                username: 'Username',
                email: 'Email',
                phone: 'Phone',
                sex: {
                    label: 'Gender',
                    male: 'Male',
                    female: 'Female',
                    other: 'Other'
                },
                birthDate: 'Birth Date',
                save: 'Save Changes',
                updating: 'Updating...',
                success: 'Update successful',
                confirmMessage: 'Do you want to save changes?',
                saving: 'Saving...',
                error: 'Unable to update information'
            },
            address: {
                title: 'Address',
                addNew: 'Add New Address',
                edit: 'Edit Address',
                fullName: 'Full Name',
                phone: 'Phone',
                province: 'Province/City',
                district: 'District',
                commune: 'Ward/Commune',
                address: 'Specific Address',
                setDefault: 'Set as Default'
            }
        },

        notifications: {
            title: 'Notifications',
            noNotifications: 'No notifications',
            markAsRead: 'Mark as Read',
            loading: 'Loading notifications...'
        },

        orderDetail: {
            title: 'Order Details',
            orderId: 'Order ID: #{{id}}',
            orderDate: 'Order Date',
            customerInfo: 'Customer Information',
            orderItems: 'Ordered Items',
            paymentInfo: 'Payment Information',
            subtotal: 'Subtotal',
            shipping: 'Shipping Fee',
            discount: 'Discount',
            total: 'Total',
            status: {
                pending: 'Pending',
                confirmed: 'Confirmed',
                shipping: 'Shipping',
                delivered: 'Delivered',
                cancelled: 'Cancelled'
            }
        },

        // Network status
        network: {
            noConnection: 'No Internet Connection',
            checkConnection: 'Please check your internet connection and try again'
        },

        payment: {
            title: 'Payment',
            address: 'Delivery Address',
            selectAddress: 'Select Address',
            products: 'Selected Products',
            voucher: {
                title: 'Voucher',
                placeholder: 'Enter voucher code',
                apply: 'Apply'
            },
            paymentMethod: {
                title: 'Payment Method',
                cod: 'Cash on Delivery',
                wallet: 'MoMo Wallet'
            },
            summary: {
                subtotal: 'Subtotal',
                shipping: 'Shipping Fee',
                discount: 'Discount',
                total: 'Total'
            },
            placeOrder: 'Place Order',
            orderSuccess: 'Order Placed Successfully',
            continueShopping: 'Continue Shopping'
        },

        // AboutUsScreen
        aboutUs: {
            title: 'About Us',
            description: 'GemStore - A Home for Book Lovers'
        },


        // OrderPaymentScreen
        orderPayment: {
            title: "Order Payment",
            address: {
                title: "Shipping Address",
                selectAddress: "Select Address",
                addNewAddress: "Add New Address"
            },
            voucher: {
                title: "Discount Code",
                placeholder: "Enter discount code",
                apply: "Apply",
                selectVoucher: "Select Voucher"
            },
            payment: {
                title: "Payment Method",
                cod: "Cash on Delivery",
                wallet: "E-Wallet",
                balance: "Balance:",
                insufficient: "Insufficient balance"
            },
            summary: {
                subtotal: "Subtotal",
                shipping: "Shipping Fee",
                discount: "Discount",
                total: "Total"
            },
            placeOrder: "Place Order",
            orderSuccess: "Order Placed Successfully",
            continueShopping: "Continue Shopping"
        },

        // SuccessfulPaymentScreen
        successPayment: {
            title: "Payment Successful!",
            subtitle: "Thank you for your purchase",
            continueShopping: "Continue Shopping"
        },

        // AccountScreen
        account: {
            title: "Account Management",
            search: "Search User",
            noResults: "No users found",
            noPhone: "Phone number not updated"
        },

        // ForgotPassword screens
        forgotPassword: {
            title: "Forgot Password",
            description: "Enter your email to receive a verification code",
            sendCode: "Send Verification Code",
            sending: "Sending code...",
            enterOTP: {
                title: "Enter OTP",
                description: "Enter the OTP sent to your email",
                timeLeft: "Time left: ",
                resend: "Resend Code",
                confirm: "Confirm",
                processing: "Processing..."
            },
            changePassword: {
                title: "Change Password",
                newPassword: "New Password",
                confirmPassword: "Confirm New Password",
                submit: "Change Password",
                success: "Password changed successfully",
                processing: "Processing...",
                error: "Unable to change password"
            },
            errors: {
                invalidEmail: "Please enter a valid email",
                invalidOTP: "Invalid OTP",
                emailNotExist: "Email does not exist",
                passwordNotMatch: "Passwords do not match",
                passwordTooShort: "Password must be at least 6 characters"
            }
        },

        // E-Wallet screens
        wallet: {
            title: "MoMo Wallet",
            balance: "Current Balance",
            recharge: {
                title: "Top Up",
                amount: "Enter amount to top up",
                confirm: "Confirm Top Up",
                message: "Do you want to top up {amount} VND?",
                success: "Top-up successful",
                error: "Unable to top up. Please try again later."
            },
            transactions: "Recent Transactions",
            transactions: {
                credit: "Top Up",
                debit: "Payment"
            }
        },

        // Order Management screens
        orderManagement: {
            title: "Order Management",
            status: {
                pending: "Pending Confirmation",
                confirmed: "Confirmed",
                shipping: "Shipping",
                delivered: "Delivered",
                cancelled: "Cancelled",
                returned: "Returned",
                return_requested: "Return Requested"
            },
            orderInfo: {
                orderId: "Order ID: #{{id}}",
                customerName: "Customer: {{name}}",
                total: "Total: {{amount}}đ",
                address: "Address: {{address}}"
            },
            actions: {
                confirm: "Confirm",
                cancel: "Cancel",
                ship: "Ship Order",
                confirmDelivery: "Confirm Delivery",
                returnConfirm: "Confirm Return"
            },
            messages: {
                confirmReturn: "Are you sure you want to confirm this return?",
                returnSuccess: "Return confirmed successfully",
                updateSuccess: "Order status updated successfully",
                updateError: "Unable to update order status"
            }
        },
        chat: {
            title: "Chat",
            userList: "User List",
            messageHint: "Enter message...",
            typing: "Typing...",
            noMessages: "No messages yet"
        },
        order: {
            title: "Orders",
            status: {
                pending: "Pending Confirmation",
                confirmed: "Confirmed",
                shipping: "Shipping",
                delivered: "Delivered",
                cancelled: "Cancelled"
            },
            details: {
                orderId: "Order ID: #{{id}}",
                total: "Total: {{amount}}đ",
                address: "Address: {{address}}",
                paymentMethod: "Method: {{method}}"
            },
            actions: {
                returnRequest: "Request Return",
                confirmReturn: "Confirm Return"
            },
            messages: {
                returnConfirm: "Are you sure you want to request a return?",
                returnSuccess: "Return request submitted",
                returnError: "Unable to submit return request"
            }
        },

        // Form fields and buttons
        form: {
            title: "Title",
            author: "Author",
            price: "Price",
            description: "Description",
            quality: "Quantity",
            selectCategory: "Select Category",
            selectStatus: "Select Status",
            submit: "Submit",
            save: "Save",
            delete: "Delete",
            cancel: "Cancel",
            chooseImage: "Choose Image",
            chooseVideo: "Choose Video",
            videoSelected: "Video Selected"
        },

        // Status options
        status: {
            active: "Active",
            outOfStock: "Out of Stock",
            importingGoods: "Importing Goods",
            stopSelling: "Stopped Selling"
        },

        // Common actions
        actions: {
            view: "View Details",
            edit: "Edit",
            delete: "Delete",
            save: "Save",
            cancel: "Cancel",
            confirm: "Confirm"
        },

        // Add missing statistics section
        statistics: {
            title: 'Revenue Statistics',
            dateRange: {
                from: 'From:',
                to: 'To:'
            },
            summary: {
                totalRevenue: 'Total Revenue',
                totalOrders: 'Total Orders',
                totalProducts: 'Products Sold'
            },
            charts: {
                paymentMethod: 'Revenue by Payment Method',
                revenueTitle: 'Revenue',
                trend: 'Revenue Trend',
                cod: 'Cash',
                wallet: 'E-Wallet'
            },
            topProducts: {
                title: 'Best Selling Products',
                quantity: 'Qty:',
                revenue: 'Rev:'
            }
        },

        // Add missing address section
        address: {
            title: 'Address',
            add: {
                title: 'Add New Address',
                fullName: 'Full Name',
                phone: 'Phone Number',
                selectProvince: 'Select Province/City',
                selectDistrict: 'Select District',
                selectWard: 'Select Ward',
                detail: 'Specific Address',
                submit: 'Add Address',
                confirm: 'Confirm adding address?'
            },
            edit: {
                title: 'Edit Address',
                submit: 'Update Address',
                confirm: 'Confirm update?'
            },
            delete: {
                title: 'Confirm Delete',
                message: 'Are you sure you want to delete this address?',
                confirm: 'Delete',
                success: 'Address deleted successfully'
            },
            setDefault: {
                title: 'Set as Default',
                confirm: 'Do you want to set this address as default?'
            },
            use: 'Use'
        },

        // Add missing voucher section
        voucher: {
            availableVouchers: 'Available Vouchers',
            name: 'Voucher Name',
            code: 'Code',
            useVoucher: 'Use Voucher',
            confirmUse: 'Apply discount {value}{type}?',
            expired: 'Voucher has expired',
            outOfStock: 'Voucher is out of stock',
            remaining: 'Remaining: {quantity}'
        },
        // Add these sections in the translation object
        support: {
            title: 'Support Center',
            contact: {
                title: 'Contact Us',
                email: 'Email: support@gemstore.com',
                phone: 'Phone: +84 123 456 789',
                hours: 'Working hours: 8:00 AM - 8:00 PM'
            },
            faq: {
                title: 'Frequently Asked Questions',
                shipping: 'Shipping Information',
                returns: 'Returns & Refunds',
                payment: 'Payment Methods'
            },
            help: {
                title: 'Need Help?',
                description: 'Our customer service team is here to help'
            }
        },

        aboutUs: {
            title: 'About GemStore',
            description: 'Your Ultimate Book Shopping Destination',
            content: {
                mission: 'Our mission is to make books accessible to everyone, everywhere.',
                vision: 'We envision a world where every book lover can find their perfect read.',
                story: 'Founded in 2024, GemStore has grown to become a trusted platform for book enthusiasts.'
            },
            features: {
                variety: 'Wide selection of books',
                service: '24/7 Customer support',
                delivery: 'Fast & reliable delivery',
                payment: 'Secure payment options'
            }
        },
        settings: {
            title: 'Settings',
            changePassword: 'Change Password',
            darkMode: {
                title: 'Dark Mode',
                light: 'Light',
                dark: 'Dark'
            },
            language: 'Language',
            support: 'Support',
            aboutUs: 'About Us'
        }
    }
};