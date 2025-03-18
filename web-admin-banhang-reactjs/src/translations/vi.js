export const vi = {
  translation: {
    // Common texts used across screens
    common: {
      search: "Tìm kiếm",
      notifications: "Thông báo",
      profile: "Hồ sơ",
      logout: "Đăng xuất",
      save: "Lưu",
      cancel: "Hủy",
      delete: "Xóa",
      edit: "Sửa",
      confirm: "Xác nhận",
      back: "Quay lại",
      add: "Thêm",
      update: "Cập nhật",
      loading: "Đang xử lý...",
      error: "Đã có lỗi xảy ra",
      confirmLogout: "Bạn có chắc chắn muốn đăng xuất không?",

      // Sidebar navigation
      nav: {
        dashboard: "Tổng quan",
        products: "Sản phẩm",
        category: "Danh mục",
        voucher: "Mã giảm giá",
        notification: "Thông báo",
        account: "Tài khoản người dùng",
        inbox: "Tin nhắn",
        orderLists: "Danh sách đơn hàng",
        productStock: "Kho hàng",
        settings: "Cài đặt",
        logout: "Đăng xuất"
      },

      // Pages section
      pages: {
        title: "TRANG",
        pricing: "Bảng giá",
        calendar: "Lịch",
        todo: "Công việc",
        contact: "Liên hệ",
        invoice: "Hóa đơn",
        uiElements: "Giao diện",
        team: "Nhóm",
        table: "Bảng"
      }
    },

    // Dashboard Screen
    dashboard: {
      title: "Tổng quan",
      totalUsers: "Tổng người dùng",
      totalOrders: "Tổng đơn hàng",
      totalSales: "Tổng doanh thu",
      totalPending: "Đang chờ xử lý",
      fromYesterday: "so với hôm qua",
      fromPastWeek: "so với tuần trước",

      charts: {
        salesDetails: "Chi tiết doanh số",
        revenueTitle: "Doanh thu",
        trend: "Xu hướng doanh thu",
        topProducts: 'Top 10 sản phẩm bán chạy'
      },

      period: {
        october: "Tháng 10",
        daily: "Hôm nay",
        weekly: "Tuần này",
        monthly: "Tháng này"
      },

      deals: {
        title: "Chi tiết giao dịch",
        productName: "Tên sản phẩm",
        location: "Địa điểm",
        dateTime: "Ngày - Giờ",
        quantity: "Số lượng",
        amount: "Số tiền",
        status: "Trạng thái",
        statusDelivered: "Đã giao"
      }
    },

    // Products Screen
    products: {
      title: "Sản phẩm",
      addProduct: "Thêm sản phẩm",
      editProduct: "Sửa sản phẩm",
      deleteProduct: "Xóa sản phẩm",
      status: {
        active: "Còn hàng",
        'out of stock': "Hết hàng",
        'importing goods': "Đang nhập hàng",
        'stop selling': "Ngừng bán"
      },
      form: {
        title: "Tiêu đề",
        author: "Tác giả",
        price: "Giá",
        quantity: "Số lượng",
        category: "Danh mục",
        description: "Mô tả",
        status: "Trạng thái",
        images: "Hình ảnh",
        videos: "Video",
        selectCategory: "Chọn danh mục"
      },
      messages: {
        confirmDelete: "Bạn có chắc chắn muốn xóa sản phẩm này?",
        deleteSuccess: "Xóa sản phẩm thành công",
        updateSuccess: "Cập nhật sản phẩm thành công",
        addSuccess: "Thêm sản phẩm thành công"
      }
    },

    // Categories Screen
    categories: {
      title: "Danh mục",
      addCategory: "Thêm danh mục",
      editCategory: "Sửa danh mục",
      deleteCategory: "Xóa danh mục",
      form: {
        name: "Tên danh mục"
      },
      messages: {
        confirmDelete: "Bạn có chắc chắn muốn xóa danh mục này?",
        deleteSuccess: "Xóa danh mục thành công",
        updateSuccess: "Cập nhật danh mục thành công",
        addSuccess: "Thêm danh mục thành công"
      }
    },

    // Thêm section mới cho vouchers
    vouchers: {
      title: "Mã giảm giá",
      addVoucher: "Thêm mã giảm giá",
      editVoucher: "Sửa mã giảm giá",
      deleteVoucher: "Xóa mã giảm giá",
      form: {
        name: "Tên mã giảm giá",
        code: "Mã code",
        discountType: "Loại giảm giá",
        discountValue: "Giá trị",
        condition: "Điều kiện",
        startDate: "Ngày bắt đầu",
        endDate: "Ngày kết thúc",
        quantity: "Số lượng",
        percentage: "Phần trăm",
        fixed: "Số tiền cố định"
      },
      messages: {
        confirmDelete: "Bạn có chắc chắn muốn xóa mã giảm giá này?",
        deleteSuccess: "Xóa mã giảm giá thành công",
        updateSuccess: "Cập nhật mã giảm giá thành công",
        addSuccess: "Thêm mã giảm giá thành công"
      }
    },

    // Accounts section
    accounts: {
      title: "Quản lý tài khoản",
      form: {
        avatar: "Ảnh đại diện",
        username: "Tên người dùng",
        email: "Email",
        phone: "Số điện thoại",
        sex: "Giới tính",
        birthDate: "Ngày sinh",
        createdAt: "Ngày tạo"
      },
      noPhone: "Chưa cập nhật",
      noGender: "Chưa cập nhật",
      noBirthDate: "Chưa cập nhật"
    },

    // Thêm section mới cho product stock
    productStock: {
      title: "Kho hàng",
      quantity: "Số lượng",
      status: "Trạng thái",
      lowStock: "Sắp hết hàng",
      outOfStock: "Hết hàng",
      inStock: "Còn hàng",
      actions: {
        view: "Xem chi tiết",
        edit: "Chỉnh sửa",
        delete: "Xóa"
      }
    },

    // Thêm section mới cho order list
    orderList: {
      title: "Danh sách đơn hàng",
      allOrders: "Tất cả đơn hàng",
      orderId: "Mã đơn",
      customer: "Khách hàng",
      totalAmount: "Tổng tiền",
      shippingAddress: "Địa chỉ giao hàng",
      statusAll: "Trạng thái",
      actions: "Thao tác",
      confirmStatusChange: "Bạn có chắc chắn muốn thay đổi trạng thái đơn hàng này?",
      statusUpdateSuccess: "Cập nhật trạng thái thành công",
      status: {
        pending: "Chờ xác nhận",
        confirmed: "Đã xác nhận",
        shipping: "Đang giao",
        delivered: "Đã giao",
        cancelled: "Đã hủy",
        returnRequested: "Yêu cầu trả hàng",
        returnApproved: "Chấp nhận trả hàng", // New translation
        returnRejected: "Từ chối trả hàng",   // New translation
        returned: "Đã trả hàng",
        reviewed: 'Đã đánh giá'
      }
    },

    // Thêm section mới cho notifications
    notifications: {
      title: "Quản lý thông báo",
      titleColumn: "Tiêu đề",
      message: "Nội dung",
      type: "Loại",
      status: "Trạng thái",
      actions: "Thao tác",
      add: "Thêm thông báo",
      edit: "Sửa thông báo",
      titleField: "Tiêu đề",
      messageField: "Nội dung",
      typeField: "Loại thông báo",
      unread: "Chưa đọc",
      confirmDelete: "Bạn có chắc chắn muốn xóa thông báo này?",
      types: {
        system: "Hệ thống",
        order: "Đơn hàng",
        promotion: "Khuyến mãi"
      }
    }
  }
};