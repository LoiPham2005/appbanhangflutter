export const vi = {
    translation: {
        // Common texts
        common: {
            settings: 'Cài đặt',
            language: {
                vietnamese: 'Tiếng Việt',
                english: 'English',
                title: 'Ngôn ngữ'
            },
            error: 'Lỗi',
            cancel: 'Hủy',
            confirm: 'Xác nhận',
            save: 'Lưu',
            success: 'Thành công',
            loading: 'Đang xử lý...',
            back: 'Quay lại',
        },

        // Welcome screen
        welcome: {
            title: 'Chào mừng đến với GemStore!',
            subtitle: 'Nơi ở cho người yêu sách',
            startButton: 'Bắt đầu ngay'
        },

        // Introduce screen
        introduce: {
            skip: 'Bỏ qua',
            getStarted: 'Bắt đầu',
            slide1: {
                title: 'Thế giới sách trong tầm tay',
                subtitle: 'Hàng ngàn cuốn sách từ các thể loại khác nhau'
            },
            slide2: {
                title: 'Nơi kết nối mọi người',
                subtitle: 'Chia sẻ sở thích đọc sách'
            },
            slide3: {
                title: 'Mua sắm dễ dàng',
                subtitle: 'Mua sắm mọi lúc, mọi nơi với ứng dụng GemStore'
            }
        },

        // Authentication screens
        auth: {
            login: {
                title: 'Đăng nhập vào tài khoản của bạn',
                email: 'Địa chỉ email',
                password: 'Mật khẩu',
                forgotPassword: 'Quên mật khẩu',
                loginButton: 'ĐĂNG NHẬP',
                noAccount: 'Bạn chưa có tài khoản?',
                register: 'Đăng ký',
                loggingIn: 'Đang đăng nhập...',
                failed: 'Đăng nhập thất bại',
                error: 'Có lỗi xảy ra khi đăng nhập',
                loginRequired: 'Vui lòng đăng nhập để tiếp tục'
            },
            register: {
                title: 'Tạo tài khoản của bạn',
                name: 'Nhập tên của bạn',
                email: 'Địa chỉ email',
                password: 'Mật khẩu',
                confirmPassword: 'Xác nhận mật khẩu',
                registerButton: 'ĐĂNG KÝ',
                haveAccount: 'Đã có tài khoản?',
                login: 'Đăng nhập',
                registering: 'Đang đăng ký...',
                success: 'Đăng ký tài khoản thành công',
                failed: 'Đăng ký thất bại',
                error: 'Có lỗi xảy ra khi đăng ký'
            },
            forgotPassword: {
                title: 'Quên mật khẩu',
                description: 'Nhập email của bạn để nhận mã xác thực',
                email: 'Địa chỉ email',
                sendCode: 'Gửi mã xác thực',
                sending: 'Đang gửi mã...',
                enterOTP: {
                    title: 'Nhập mã OTP',
                    description: 'Nhập mã OTP đã được gửi đến email của bạn',
                    timeLeft: 'Thời gian còn lại: ',
                    resend: 'Gửi lại mã',
                    confirm: 'Xác nhận',
                    processing: 'Đang xử lý...'
                },
                changePassword: {
                    title: 'Đổi mật khẩu',
                    newPassword: 'Mật khẩu mới',
                    confirmPassword: 'Xác nhận mật khẩu mới',
                    submit: 'Đổi mật khẩu',
                    success: 'Đổi mật khẩu thành công',
                    processing: 'Đang xử lý...',
                    error: 'Không thể thay đổi mật khẩu',
                    success: 'Thay đổi mật khẩu thành công',
                    processing: 'Đang xử lý...'
                },
                errors: {
                    invalidEmail: 'Vui lòng nhập email hợp lệ',
                    invalidOTP: 'Mã OTP không đúng',
                    emailNotExist: 'Email không tồn tại',
                    passwordNotMatch: 'Mật khẩu không khớp',
                    passwordTooShort: 'Mật khẩu phải có ít nhất 6 ký tự'
                }
            }
        },

        // Validation messages
        validation: {
            required: 'Vui lòng nhập thông tin này',
            emptyName: 'Vui lòng nhập tên',
            emptyEmail: 'Vui lòng nhập email',
            invalidEmail: 'Email không đúng định dạng',
            emptyPassword: 'Vui lòng nhập mật khẩu',
            passwordLength: 'Mật khẩu phải có ít nhất 6 ký tự',
            emptyConfirmPassword: 'Vui lòng xác nhận mật khẩu',
            passwordMismatch: 'Mật khẩu không khớp'
        },

        // Drawer menu
        drawer: {
            home: 'Trang chủ',
            cart: 'Giỏ hàng',
            orders: 'Đơn hàng',
            profile: 'Hồ sơ cá nhân',
            accountManagement: 'Quản lý tài khoản',
            orderManagement: 'Quản lý đơn hàng',
            productManagement: 'Quản lý sản phẩm',
            statistics: 'Thống kê doanh thu',
            other: 'Khác',
            settings: 'Cài đặt',
            support: 'Hỗ trợ',
            aboutUs: 'Về chúng tôi',
            exit: 'Thoát',
            logout: 'Đăng xuất',
            mode: 'Chế độ',
            lightMode: 'Sáng',
            darkMode: {
                title: 'Chế độ tối',
                light: 'Sáng',
                dark: 'Tối'
            },
            language: 'Ngôn ngữ',
            logoutConfirmMessage: 'Bạn có chắc chắn muốn đăng xuất không?'
        },

        // Home screen
        home: {
            bestsellers: 'Sách bán chạy',
            onSale: 'Sách giảm giá',
            goldenDeals: 'Ưu đãi vàng',
            featured: 'Sản phẩm nổi bật',
            viewAll: 'Hiển thị tất cả'
        },

        // Search screen  
        search: {
            title: 'Tìm kiếm',
            placeholder: 'Nhập từ khóa tìm kiếm...',
            searching: 'Đang tìm kiếm...',
            noResults: 'Không tìm thấy kết quả',
            searchButton: 'Tìm',
            searchHistory: 'Lịch sử tìm kiếm',
            clearHistory: 'Xóa lịch sử'
        },

        // Product management
        productManagement: {
            title: 'Quản lý sản phẩm',
            products: 'Sản phẩm',
            inventory: 'Kho hàng',
            returns: 'Trả hàng',
            addNew: 'Thêm sản phẩm mới',
            cancel: 'Hủy',
            details: 'Xem chi tiết',
            edit: 'Chỉnh sửa',
            delete: 'Xóa',
            chooseVideo: 'Chọn Video',
            videoSelected: 'Đã chọn video',
            add: {
                title: 'Thêm sản phẩm mới',
                productName: 'Tên sản phẩm',
                author: 'Tác giả',
                price: 'Giá',
                quantity: 'Số lượng',
                category: 'Danh mục',
                description: 'Mô tả',
                chooseImage: 'Chọn ảnh',
                chooseVideo: 'Chọn video',
                submit: 'Thêm sản phẩm'
            },
            edit: {
                title: 'Sửa sản phẩm',
                save: 'Lưu thay đổi'
            },
            delete: {
                title: 'Xóa sản phẩm',
                confirm: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
                success: 'Xóa sản phẩm thành công'
            },
            product: {
                title: 'Sản phẩm',
                emptyText: 'Không có sản phẩm nào',
                details: {
                    name: 'Tên sản phẩm',
                    author: 'Tác giả',
                    price: 'Giá',
                    quantity: 'Số lượng'
                },
                actions: {
                    view: 'Xem chi tiết',
                    edit: 'Sửa',
                    delete: 'Xóa',
                    confirm: 'Xác nhận',
                    cancel: 'Hủy'
                },
                messages: {
                    deleteConfirm: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
                    deleteSuccess: 'Đã xóa sản phẩm thành công',
                    deleteError: 'Không thể xóa sản phẩm'
                }
            },
            addProduct: {
                title: 'Thêm sản phẩm mới',
                permissionDenied: 'Không có quyền truy cập thư viện ảnh',
                errorSelectingImage: 'Lỗi khi chọn ảnh',
                errorSelectingVideo: 'Lỗi khi chọn video',
                fillAllFields: 'Vui lòng điền đầy đủ thông tin',
                confirm: 'Xác nhận',
                confirmMessage: 'Bạn có chắc chắn muốn thêm sản phẩm này?',
                success: 'Thêm sản phẩm thành công',
                error: 'Có lỗi xảy ra khi thêm sản phẩm',
                deleteMedia: {
                    title: 'Xác nhận xóa',
                    message: 'Bạn có chắc chắn muốn xóa media này không?',
                    cancel: 'Hủy',
                    confirm: 'Xóa'
                },
                fillAllFields: 'Vui lòng điền đầy đủ thông tin',
                confirm: 'Xác nhận',
                confirmMessage: 'Bạn có chắc chắn muốn thêm sản phẩm này?',

                uploading: 'Đang tải lên...',
                permissionDenied: 'Cần cấp quyền truy cập thư viện ảnh',
                errorSelectingImage: 'Lỗi khi chọn ảnh',
                uploadingMedia: 'Đang tải lên...',
            },
            editProduct: {
                title: 'Chỉnh sửa sản phẩm',
                permissionDenied: 'Không có quyền truy cập thư viện ảnh',
                errorSelectingImage: 'Lỗi khi chọn ảnh',
                errorSelectingVideo: 'Lỗi khi chọn video',
                fillAllFields: 'Vui lòng điền đầy đủ thông tin',
                confirmTitle: 'Xác nhận chỉnh sửa',
                confirmMessage: 'Bạn có chắc chắn muốn lưu thay đổi?',
                success: 'Cập nhật sản phẩm thành công',
                error: 'Có lỗi xảy ra khi cập nhật sản phẩm',
                uploading: 'Đang cập nhật...'
            },
            tabProducts: {
                noProducts: 'Không có sản phẩm nào',
                deleteConfirm: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
                deleteSuccess: 'Xóa sản phẩm thành công',
                deleteError: 'Không thể xóa sản phẩm',
                deleting: 'Đang xóa...',
                askdelete: 'xác nhận xóa'

            }
        },

        // Product form fields
        product: {
            name: 'Tên sản phẩm',
            author: 'Tác giả',
            price: 'Giá',
            quantity: 'Số lượng',
            description: 'Mô tả',
            status: 'Trạng thái',
            active: 'Hoạt động',
            outOfStock: 'Hết hàng',
            stopSelling: 'Ngừng bán',
            importing: 'Đang nhập hàng',
            active: 'Còn hàng',
            outOfStock: 'Hết hàng',
            importingGoods: 'Đang nhập hàng',
            stopSelling: 'Ngừng bán',
        },

        inventory: {
            title: 'Kho hàng',
            emptyText: 'Không có sản phẩm nào',
            status: {
                active: 'Còn hàng',
                outOfStock: 'Hết hàng',
                importing: 'Đang nhập hàng',
                stopSelling: 'Ngừng bán'
            }
        },

        // Product detail
        productDetail: {
            addToCart: 'Thêm vào giỏ hàng',
            author: 'Tác giả',
            quantity: 'Số lượng',
            category: 'Danh mục',
            description: 'Mô tả',
            status: {
                active: 'Còn hàng',
                'out of stock': 'Hết hàng',
                'importing goods': 'Đang nhập hàng',
                'stop selling': 'Ngừng bán'
            },
            confirm: 'Xác nhận',
            askCart: 'Bạn có muốn thêm sản phẩm này vào giỏ hàng?',
            videoPlaybackError: 'Không thể phát video'
        },

        // Cart screen
        cart: {
            confirmDelete: 'Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?',
            yes: 'Có',
            no: 'Không',
            addSuccess: 'Đã thêm vào giỏ hàng',
            addError: 'Không thể thêm vào giỏ hàng',
            loginRequired: 'Vui lòng đăng nhập để thêm vào giỏ hàng',
            continueShopping: 'Tiếp tục mua sắm',
            viewCart: 'Xem giỏ hàng',
            adding: 'Đang thêm vào giỏ hàng...',
            productNotAvailable: 'Sản phẩm này hiện không có sẵn',
            total: 'Tổng tiền',
            updateError: 'Không thể cập nhật số lượng',
            quantity: 'Số lượng',
            buy: 'Mua',
            selectItemsToBuy: 'Vui lòng chọn sản phẩm để mua'
        },

        // Order screen
        order: {
            title: 'Thanh toán đơn hàng',
            deliveryAddress: 'Địa chỉ giao hàng',
            enterAddress: 'Nhập địa chỉ giao hàng',
            selectedItems: 'Sản phẩm đã chọn',
            voucher: 'Mã giảm giá',
            enterVoucher: 'Nhập mã giảm giá',
            apply: 'Áp dụng',
            paymentMethod: 'Phương thức thanh toán',
            cod: 'Thanh toán khi nhận hàng',
            subtotal: 'Tạm tính',
            shippingFee: 'Phí vận chuyển',
            discount: 'Giảm giá',
            total: 'Tổng cộng',
            placeOrder: 'Đặt hàng',
            return: {
                title: 'Yêu cầu trả hàng',
                reasonPlaceholder: 'Nhập lý do trả hàng...',
                addImages: 'Thêm ảnh',
                submit: 'Gửi yêu cầu',
                success: 'Đã gửi yêu cầu trả hàng thành công',
                error: 'Không thể gửi yêu cầu trả hàng',
                reasonRequired: 'Vui lòng nhập lý do trả hàng',
            },
            status: {
                pending: 'Chờ xác nhận',
                confirmed: 'Đã xác nhận',
                shipping: 'Đang giao',
                delivered: 'Đã giao',
                cancelled: 'Đã hủy',
                return_approved: 'Đã chấp nhận',
                return_rejected: 'Đã từ chối',
            }
        },

        // Profile screen
        profile: {
            personalInfo: 'Thông tin cá nhân',
            orders: 'Đơn hàng của tôi',
            settings: 'Cài đặt',
            help: 'Trợ giúp',
            address1: 'Địa chỉ',
            paymentMethod: 'Phương thức thanh toán',
            voucher: 'Phiếu mua hàng',
            wishlist: 'Danh sách yêu thích',
            appReviews: 'Đánh giá ứng dụng',
            username: 'Tên người dùng',
            sex: 'Giới tính',
            male: 'Nam',
            female: 'Nữ',
            other: 'Khác',
            phone: 'Số điện thoại',
            birthDate: 'Ngày sinh',
            save: 'Lưu thay đổi',
            updating: 'Đang cập nhật...',
            updateSuccess: 'Cập nhật thông tin thành công',
            updateError: 'Không thể cập nhật thông tin',
            permissionDenied: 'Cần cấp quyền truy cập thư viện ảnh',
            title: 'Hồ sơ',
            editProfile: {
                title: 'Sửa thông tin cá nhân',
                personalInfo: 'Thông tin cá nhân',
                username: 'Tên người dùng',
                email: 'Email',
                phone: 'Số điện thoại',
                sex: {
                    label: 'Giới tính',
                    male: 'Nam',
                    female: 'Nữ',
                    other: 'Khác'
                },
                birthDate: 'Ngày sinh',
                save: 'Lưu thay đổi',
                updating: 'Đang cập nhật...',
                success: 'Cập nhật thành công',
                confirmMessage: 'Bạn có muốn lưu thay đổi không?',
                saving: 'Đang lưu...',
                error: 'Không thể cập nhật thông tin'
            },
            address: {
                title: 'Địa chỉ',
                addNew: 'Thêm địa chỉ mới',
                edit: 'Sửa địa chỉ',
                fullName: 'Họ và tên',
                phone: 'Số điện thoại',
                province: 'Tỉnh/Thành phố',
                district: 'Quận/Huyện',
                commune: 'Phường/Xã',
                address: 'Địa chỉ cụ thể',
                setDefault: 'Đặt làm mặc định'
            }
        },

        notifications: {
            title: 'Thông báo',
            noNotifications: 'Không có thông báo nào',
            markAsRead: 'Đánh dấu đã đọc',
            loading: 'Đang tải thông báo...'
        },

        orderDetail: {
            title: 'Chi tiết đơn hàng',
            orderId: 'Mã đơn: #{{id}}',
            orderDate: 'Thời gian đặt',
            customerInfo: 'Thông tin khách hàng',
            orderItems: 'Sản phẩm đặt mua',
            paymentInfo: 'Thông tin thanh toán',
            subtotal: 'Tạm tính',
            shipping: 'Phí vận chuyển',
            discount: 'Giảm giá',
            total: 'Tổng cộng',
            status: {
                pending: 'Chờ xác nhận',
                confirmed: 'Đã xác nhận',
                shipping: 'Đang giao',
                delivered: 'Đã giao',
                cancelled: 'Đã hủy'
            }
        },

        // Network status
        network: {
            noConnection: 'Không có kết nối mạng',
            checkConnection: 'Vui lòng kiểm tra kết nối internet của bạn và thử lại'
        },

        payment: {
            title: 'Thanh toán',
            address: 'Địa chỉ giao hàng',
            selectAddress: 'Chọn địa chỉ',
            products: 'Sản phẩm đã chọn',
            voucher: {
                title: 'Mã giảm giá',
                placeholder: 'Nhập mã giảm giá',
                apply: 'Áp dụng'
            },
            paymentMethod: {
                title: 'Phương thức thanh toán',
                cod: 'Thanh toán khi nhận hàng',
                wallet: 'Ví MoMo'
            },
            summary: {
                subtotal: 'Tạm tính',
                shipping: 'Phí vận chuyển',
                discount: 'Giảm giá',
                total: 'Tổng cộng'
            },
            placeOrder: 'Đặt hàng',
            orderSuccess: 'Đặt hàng thành công',
            continueShopping: 'Tiếp tục mua sắm'
        },

        // AboutUsScreen
        aboutUs: {
            title: 'Về chúng tôi',
            description: 'GemStore - Nơi ở cho người yêu sách'
        },

        // OrderPaymentScreen
        orderPayment: {
            title: 'Thanh toán đơn hàng',
            address: {
                title: 'Địa chỉ giao hàng',
                selectAddress: 'Chọn địa chỉ',
                addNewAddress: 'Thêm địa chỉ mới'
            },
            voucher: {
                title: 'Mã giảm giá',
                placeholder: 'Nhập mã giảm giá',
                apply: 'Áp dụng',
                selectVoucher: 'Chọn voucher'
            },
            payment: {
                title: 'Phương thức thanh toán',
                cod: 'Thanh toán khi nhận hàng',
                wallet: 'Ví điện tử',
                balance: 'Số dư:',
                insufficient: 'Số dư không đủ'
            },
            summary: {
                subtotal: 'Tạm tính',
                shipping: 'Phí vận chuyển',
                discount: 'Giảm giá',
                total: 'Tổng cộng'
            },
            placeOrder: 'Đặt hàng',
            orderSuccess: 'Đặt hàng thành công',
            continueShopping: 'Tiếp tục mua sắm'
        },

        // SuccessfulPaymentScreen 
        successPayment: {
            title: 'Thanh toán thành công!',
            subtitle: 'Cảm ơn bạn đã mua hàng',
            continueShopping: 'Tiếp tục mua sắm'
        },

        // AccountScreen
        account: {
            title: 'Quản lý tài khoản',
            search: 'Tìm kiếm người dùng',
            noResults: 'Không tìm thấy người dùng',
            noPhone: 'Chưa cập nhật số điện thoại'
        },

        // ForgotPassword screens
        forgotPassword: {
            title: 'Quên mật khẩu',
            description: 'Nhập email của bạn để nhận mã xác thực',
            sendCode: 'Gửi mã xác thực',
            sending: 'Đang gửi mã...',
            enterOTP: {
                title: 'Nhập mã OTP',
                description: 'Nhập mã OTP đã được gửi đến email của bạn',
                timeLeft: 'Thời gian còn lại: ',
                resend: 'Gửi lại mã',
                confirm: 'Xác nhận',
                processing: 'Đang xử lý...'
            },
            changePassword: {
                title: 'Đổi mật khẩu',
                newPassword: 'Mật khẩu mới',
                confirmPassword: 'Xác nhận mật khẩu mới',
                submit: 'Đổi mật khẩu',
                success: 'Đổi mật khẩu thành công',
                processing: 'Đang xử lý...',
                error: 'Không thể thay đổi mật khẩu',
                success: 'Thay đổi mật khẩu thành công',
                processing: 'Đang xử lý...'
            },
            errors: {
                invalidEmail: 'Vui lòng nhập email hợp lệ',
                invalidOTP: 'Mã OTP không đúng',
                emailNotExist: 'Email không tồn tại',
                passwordNotMatch: 'Mật khẩu không khớp',
                passwordTooShort: 'Mật khẩu phải có ít nhất 6 ký tự'
            }
        },

        // E-Wallet screens
        wallet: {
            title: 'Ví MoMo',
            balance: 'Số dư hiện tại',
            history: 'Lịch sử giao dịch',
            transactions: {
                default: 'Giao dịch',
                credit: 'Nạp tiền',
                debit: 'Thanh toán',
                date: 'Ngày: {{date}}',
                time: 'Thời gian: {{time}}'
            },
            recharge: {
                title: 'Nạp tiền',
                amount: 'Nhập số tiền muốn nạp',
                confirm: 'Xác nhận nạp tiền',
                message: 'Bạn có muốn nạp {{amount}} VND không?',
                success: 'Nạp tiền thành công',
                error: 'Không thể nạp tiền. Vui lòng thử lại sau.',
                invalidAmount: 'Vui lòng nhập số tiền hợp lệ'
            }
        },

        // Order Management screens
        orderManagement: {
            title: 'Quản lý đơn hàng',
            status: {
                pending: 'Chờ xác nhận',
                confirmed: 'Đã xác nhận',
                shipping: 'Đang giao',
                delivered: 'Đã giao',
                cancelled: 'Đã hủy',
                returned: 'Đã trả hàng',
                return_requested: 'Yêu cầu trả'
            },
            orderInfo: {
                orderId: 'Mã đơn: #{{id}}',
                customerName: 'Khách hàng: {{name}}',
                total: 'Tổng tiền: {{amount}}đ',
                address: 'Địa chỉ: {{address}}'
            },
            actions: {
                confirm: 'Xác nhận',
                cancel: 'Hủy',
                ship: 'Chuyển giao hàng',
                confirmDelivery: 'Xác nhận đã giao',
                returnConfirm: 'Xác nhận trả hàng'
            },
            messages: {
                confirmReturn: 'Bạn có chắc chắn muốn xác nhận trả hàng này?',
                returnSuccess: 'Đã xác nhận trả hàng',
                updateSuccess: 'Đã cập nhật trạng thái đơn hàng',
                updateError: 'Không thể cập nhật trạng thái đơn hàng'
            }
        },
        chat: {
            title: 'Trò chuyện',
            userList: 'Danh sách người dùng',
            messageHint: 'Nhập tin nhắn...',
            typing: 'Đang nhập...',
            noMessages: 'Chưa có tin nhắn'
        },
        order: {
            title: 'Đơn hàng',
            status: {
                pending: 'Chờ xác nhận',
                confirmed: 'Đã xác nhận',
                shipping: 'Đang giao',
                delivered: 'Đã giao',
                cancelled: 'Đã hủy',
                return_approved: 'Đã chấp nhận',
                return_rejected: 'Đã từ chối',
            },
            details: {
                orderId: 'Mã đơn: #{{id}}',
                total: 'Tổng tiền: {{amount}}đ',
                address: 'Địa chỉ: {{address}}',
                paymentMethod: 'Phương thức: {{method}}'
            },
            actions: {
                returnRequest: 'Yêu cầu trả hàng',
                confirmReturn: 'Xác nhận trả hàng'
            },
            messages: {
                returnConfirm: 'Bạn có chắc chắn muốn yêu cầu trả hàng?',
                returnSuccess: 'Đã gửi yêu cầu trả hàng',
                returnError: 'Không thể gửi yêu cầu trả hàng'
            },
            return: {
                title: 'Yêu cầu trả hàng',
                reasonPlaceholder: 'Nhập lý do trả hàng...',
                addImages: 'Thêm ảnh',
                submit: 'Gửi yêu cầu',
                success: 'Đã gửi yêu cầu trả hàng thành công',
                error: 'Không thể gửi yêu cầu trả hàng',
                reasonRequired: 'Vui lòng nhập lý do trả hàng',
            }
        },

        // Form fields and buttons
        form: {
            title: 'Tiêu đề',
            author: 'Tác giả',
            price: 'Giá',
            description: 'Mô tả',
            quality: 'Số lượng',
            selectCategory: 'Chọn danh mục',
            selectStatus: 'Chọn trạng thái',
            submit: 'Xác nhận',
            save: 'Lưu',
            delete: 'Xóa',
            cancel: 'Hủy',
            chooseImage: 'Chọn ảnh',
            chooseVideo: 'Chọn video',
            videoSelected: 'Video đã chọn'
        },

        // Status options
        status: {
            active: 'Đang hoạt động',
            outOfStock: 'Hết hàng',
            importingGoods: 'Đang nhập hàng',
            stopSelling: 'Ngừng bán'
        },

        // Common actions
        actions: {
            view: 'Xem chi tiết',
            edit: 'Chỉnh sửa',
            delete: 'Xóa',
            save: 'Lưu',
            cancel: 'Hủy',
            confirm: 'Xác nhận'
        },
        statistics: {
            title: 'Thống kê doanh thu',
            dateRange: {
                from: 'Từ:',
                to: 'Đến:'
            },
            summary: {
                totalRevenue: 'Tổng doanh thu',
                totalOrders: 'Tổng đơn hàng',
                totalProducts: 'Sản phẩm đã bán'
            },
            charts: {
                paymentMethod: 'Doanh thu theo phương thức thanh toán',
                revenueTitle: 'Doanh thu',
                trend: 'Xu hướng doanh thu',
                cod: 'Tiền mặt',
                wallet: 'Ví điện tử'
            },
            topProducts: {
                title: 'Sản phẩm bán chạy',
                quantity: 'SL:',
                revenue: 'DT:'
            }
        },
        address: {
            title: 'Địa chỉ',
            add: {
                title: 'Thêm địa chỉ mới',
                fullName: 'Họ và tên',
                phone: 'Số điện thoại',
                selectProvince: 'Chọn tỉnh/thành',
                selectDistrict: 'Chọn quận/huyện',
                selectWard: 'Chọn phường/xã',
                detail: 'Địa chỉ cụ thể',
                submit: 'Thêm địa chỉ',
                confirm: 'Xác nhận thêm địa chỉ?'
            },
            edit: {
                title: 'Sửa địa chỉ',
                submit: 'Cập nhật địa chỉ',
                confirm: 'Xác nhận cập nhật?'
            },
            delete: {
                title: 'Xác nhận xóa',
                message: 'Bạn có chắc chắn muốn xóa địa chỉ này không?',
                confirm: 'Xóa',
                success: 'Xóa địa chỉ thành công'
            },
            setDefault: {
                title: 'Đặt làm mặc định',
                confirm: 'Bạn có muốn đặt địa chỉ này làm mặc định không?'
            },
            use: 'Sử dụng'
        },
        voucher: {
            availableVouchers: 'Voucher khả dụng',
            name: 'Tên voucher',
            code: 'Mã',
            useVoucher: 'Sử dụng voucher',
            confirmUse: 'Áp dụng giảm giá {value}{type}?',
            expired: 'Voucher đã hết hạn',
            outOfStock: 'Voucher đã hết lượt sử dụng',
            remaining: 'Còn lại: {quantity}'
        },
        // Add these sections in the translation object
        support: {
            title: 'Trung tâm Hỗ trợ',
            contact: {
                title: 'Liên hệ',
                email: 'Email: support@gemstore.com',
                phone: 'Điện thoại: +84 123 456 789',
                hours: 'Giờ làm việc: 8:00 - 20:00'
            },
            faq: {
                title: 'Câu hỏi thường gặp',
                shipping: 'Thông tin vận chuyển',
                returns: 'Đổi trả & Hoàn tiền',
                payment: 'Phương thức thanh toán'
            },
            help: {
                title: 'Cần giúp đỡ?',
                description: 'Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng phục vụ'
            }
        },

        aboutUs: {
            title: 'Về GemStore',
            description: 'Điểm đến mua sắm sách lý tưởng của bạn',
            content: {
                mission: 'Sứ mệnh của chúng tôi là đưa sách đến gần hơn với mọi người, ở mọi nơi.',
                vision: 'Chúng tôi hướng đến một thế giới nơi mỗi người yêu sách đều có thể tìm thấy cuốn sách hoàn hảo của mình.',
                story: 'Được thành lập vào năm 2024, GemStore đã phát triển thành một nền tảng đáng tin cậy cho những người yêu sách.'
            },
            features: {
                variety: 'Đa dạng sách',
                service: 'Hỗ trợ 24/7',
                delivery: 'Giao hàng nhanh chóng',
                payment: 'Thanh toán an toàn'
            }
        },
        settings: {
            title: 'Cài đặt',
            changePassword: 'Đổi mật khẩu',
            darkMode: {
                title: 'Chế độ tối',
                light: 'Sáng',
                dark: 'Tối'
            },
            language: 'Ngôn ngữ',
            support: 'Hỗ trợ',
            aboutUs: 'Về chúng tôi'
        },
        review: {
            title: 'Đánh giá sản phẩm',
            ratingLabel: 'Đánh giá của bạn',
            commentPlaceholder: 'Chia sẻ trải nghiệm của bạn về sản phẩm...',
            addImages: 'Thêm hình ảnh',
            submit: 'Gửi đánh giá',
            success: 'Đánh giá của bạn đã được gửi thành công!',
            thankYou: 'Cảm ơn bạn đã đánh giá!',
            commentRequired: 'Vui lòng nhập nội dung đánh giá',
            submitError: 'Không thể gửi đánh giá, vui lòng thử lại sau',
            error: {
                noItems: 'Không có sản phẩm hợp lệ để đánh giá',
                unavailableProducts: 'Một số sản phẩm không khả dụng để đánh giá',
                generalError: 'Có lỗi xảy ra khi đánh giá sản phẩm',
                sessionExpired: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
                imageUploadFailed: 'Không thể tải lên hình ảnh, vui lòng thử lại',
                noRating: 'Vui lòng đánh giá số sao cho tất cả sản phẩm',
            }
        }
    }
};