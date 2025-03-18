export const en = {
  translation: {
    // Common texts used across screens
    common: {
      search: "Search",
      notifications: "Notifications",
      profile: "Profile",
      logout: "Logout",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      confirm: "Confirm",
      back: "Back",
      add: "Add",
      update: "Update",
      loading: "Processing...",
      error: "An error occurred",

      // Sidebar navigation
      nav: {
        dashboard: "Dashboard",
        products: "Products",
        category: "Category",
        voucher: "Voucher",
        notification: "Notification",
        account: "Account User",
        inbox: "Inbox",
        orderLists: "Order Lists",
        productStock: "Product Stock",
        settings: "Settings",
        logout: "Logout"
      },

      // Pages section  
      pages: {
        title: "PAGES",
        pricing: "Pricing",
        calendar: "Calendar",
        todo: "To-Do",
        contact: "Contact",
        invoice: "Invoice",
        uiElements: "UI Elements",
        team: "Team",
        table: "Table"
      }
    },

    // Dashboard Screen
    dashboard: {
      title: "Dashboard",
      totalSales: "Total Sales",
      totalOrders: "Total Orders",
      totalProducts: "Total Products",
      totalUsers: "Total Users",
      totalPending: "Total Pending",
      fromYesterday: "from yesterday",
      fromPastWeek: "from last week",

      charts: {
        salesDetails: "Sales Details",
        revenueTitle: "Revenue",
        trend: "Revenue Trend"
      },

      period: {
        october: "October",
        daily: "Today",
        weekly: "This Week",
        monthly: "This Month"
      },

      deals: {
        title: "Transaction Details",
        productName: "Product Name",
        location: "Location",
        dateTime: "Date - Time",
        quantity: "Quantity",
        amount: "Amount",
        status: "Status",
        statusDelivered: "Delivered"
      }
    },

    // Products Screen
    products: {
      title: "Products",
      addProduct: "Add Product",
      editProduct: "Edit Product",
      deleteProduct: "Delete Product",
      status: {
        active: "In Stock",
        'out of stock': "Out of Stock",
        'importing goods': "Importing",
        'stop selling': "Stop Selling"
      },
      form: {
        title: "Title",
        author: "Author",
        price: "Price",
        quantity: "Quantity",
        category: "Category",
        description: "Description",
        status: "Status",
        images: "Images",
        videos: "Videos"
      },
      messages: {
        confirmDelete: "Are you sure you want to delete this product?",
        deleteSuccess: "Product deleted successfully",
        updateSuccess: "Product updated successfully",
        addSuccess: "Product added successfully"
      }
    },

    // Categories Screen  
    categories: {
      title: "Categories",
      addCategory: "Add Category",
      editCategory: "Edit Category",
      deleteCategory: "Delete Category",
      form: {
        name: "Category Name"
      },
      messages: {
        confirmDelete: "Are you sure you want to delete this category?",
        deleteSuccess: "Category deleted successfully",
        updateSuccess: "Category updated successfully",
        addSuccess: "Category added successfully"
      }
    },

    // Vouchers Screen
    vouchers: {
      title: "Vouchers",
      addVoucher: "Add Voucher",
      editVoucher: "Edit Voucher",
      deleteVoucher: "Delete Voucher",
      form: {
        name: "Voucher Name",
        code: "Code",
        discountType: "Discount Type",
        discountValue: "Value",
        condition: "Condition",
        startDate: "Start Date",
        endDate: "End Date",
        quantity: "Quantity",
        percentage: "Percentage",
        fixed: "Fixed Amount"
      },
      messages: {
        confirmDelete: "Are you sure you want to delete this voucher?",
        deleteSuccess: "Voucher deleted successfully",
        updateSuccess: "Voucher updated successfully",
        addSuccess: "Voucher added successfully"
      }
    },

    // Accounts Screen
    accounts: {
      title: "Account Management",
      form: {
        avatar: "Avatar",
        username: "Username",
        email: "Email",
        phone: "Phone",
        sex: "Gender",
        birthDate: "Birth Date",
        createdAt: "Created At"
      },
      noPhone: "Not updated",
      noGender: "Not updated",
      noBirthDate: "Not updated"
    },

    // Product Stock Screen
    productStock: {
      title: "Product Stock",
      quantity: "Quantity",
      status: "Status",
      lowStock: "Low Stock",
      outOfStock: "Out of Stock",
      inStock: "In Stock",
      actions: {
        view: "View Details",
        edit: "Edit",
        delete: "Delete"
      }
    },

    // Add new section for order list
    orderList: {
      title: "Order List",
      allOrders: "All Orders",
      orderId: "Order ID",
      customer: "Customer",
      totalAmount: "Total Amount",
      shippingAddress: "Shipping Address",
      statusAll: "Status",
      actions: "Actions",
      confirmStatusChange: "Are you sure you want to change this order's status?",
      statusUpdateSuccess: "Status updated successfully",
      status: {
        pending: "Pending",
        confirmed: "Confirmed",
        shipping: "Shipping",
        delivered: "Delivered",
        cancelled: "Cancelled",
        returnRequested: "Return Requested",
        returnApproved: "Return Approved", // New translation
        returnRejected: "Return Rejected", // New translation
        returned: "Returned",
        reviewed: 'Reviewed'
      }
    },

    // Add to the translation object
    notifications: {
      title: "Notification Management",
      titleColumn: "Title",
      message: "Message",
      type: "Type",
      status: "Status",
      actions: "Actions",
      add: "Add Notification",
      edit: "Edit Notification",
      titleField: "Title",
      messageField: "Message",
      typeField: "Notification Type",
      unread: "Unread",
      confirmDelete: "Are you sure you want to delete this notification?",
      types: {
        system: "System",
        order: "Order",
        promotion: "Promotion"
      }
    }
  }
};