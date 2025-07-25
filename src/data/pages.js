// data/pages.js
export const defaultPages = {
  cover: {
    id: 'cover',
    title: 'Welcome Page',
    enabled: true,
    backgroundImage: null,
    components: {
      title: { 
        text: 'Welcome to Our Service', 
        position: { x: 100, y: 100 },
        style: {
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#000000',
          backgroundColor: 'rgba(255, 255, 255, 0)',
          padding: '10px',
          borderRadius: '4px'
        }
      },
      description: { 
        text: 'This is our awesome service description', 
        position: { x: 100, y: 150 },
        style: {
          fontSize: '16px',
          color: '#333333',
          backgroundColor: 'rgba(255, 255, 255, 0)',
          padding: '10px',
          borderRadius: '4px',
          maxWidth: '300px'
        }
      },
      logo: { 
        image: null, 
        position: { x: 100, y: 200 },
        style: {
          width: '150px',
          height: 'auto',
          backgroundColor: 'transparent'
        }
      },
      message: { 
        text: 'Get started today!', 
        position: { x: 100, y: 250 },
        style: {
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#ffffff',
          backgroundColor: '#007bff',
          padding: '10px 15px',
          borderRadius: '4px'
        }
      }
    }
  },
  terms: {
    id: 'terms',
    title: 'Terms & Conditions',
    enabled: false,
    backgroundImage: null,
    components: {
      title: { 
        text: 'Terms & Conditions', 
        position: { x: 100, y: 100 },
        style: {
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#000000',
          backgroundColor: 'rgba(255, 255, 255, 0)',
          padding: '10px',
          borderRadius: '4px'
        }
      },
      content: { 
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.', 
        position: { x: 100, y: 150 },
        style: {
          fontSize: '14px',
          color: '#333333',
          backgroundColor: 'rgba(255, 255, 255, 0)',
          padding: '15px',
          borderRadius: '4px',
          maxWidth: '500px'
        }
      }
    }
  },
billing: {
  id: 'billing',
  title: 'Billing Information',
  enabled: true,
  backgroundImage: null,
  components: {
    invoiceHeader: {
      type: 'richText',
      content: `
        <h1 style="margin-bottom: 10px;">INVOICE</h1>
        <p><strong>Company Name:</strong> Your Company</p>
        <p><strong>Address:</strong> 123 Business Road, City</p>
        <p><strong>Invoice #:</strong> INV-${new Date().getFullYear()}-001</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      `,
      position: { x: 50, y: 50 },
      style: {
        width: '400px',
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }
    },
    billTo: {
      type: 'richText',
      content: `
        <h3 style="margin-bottom: 15px;">BILL TO</h3>
        <p><strong>Client Name:</strong> _______________</p>
        <p><strong>Company:</strong> _______________</p>
        <p><strong>Address:</strong> _______________</p>
        <p><strong>Email:</strong> _______________</p>
      `,
      position: { x: 500, y: 50 },
      style: {
        width: '400px',
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }
    },
    invoiceTable: {
      type: 'editableTable',
      columns: [
        { id: 'description', label: 'Description', width: '40%' },
        { id: 'quantity', label: 'Qty', width: '15%' },
        { id: 'price', label: 'Price', width: '20%' },
        { id: 'total', label: 'Total', width: '25%' }
      ],
      rows: [
        {
          description: 'Website Development',
          quantity: '1',
          price: '$1,000.00',
          total: '$1,000.00'
        },
        {
          description: 'Hosting (1 year)',
          quantity: '1',
          price: '$200.00',
          total: '$200.00'
        }
      ],
      position: { x: 50, y: 250 },
      style: {
        width: '800px',
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }
    },
    summary: {
      type: 'richText',
      content: `
        <div style="text-align: right; margin-top: 20px;">
          <p><strong>Subtotal:</strong> $1,200.00</p>
          <p><strong>Tax (10%):</strong> $120.00</p>
          <p><strong>Total:</strong> $1,320.00</p>
          <p style="margin-top: 30px;"><strong>Payment Due:</strong> Upon Receipt</p>
        </div>
      `,
      position: { x: 600, y: 500 },
      style: {
        width: '300px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }
    }
  }
},
  thanks: {
    id: 'thanks',
    title: 'Thank You',
    enabled: false,
    backgroundImage: null,
    components: {
      title: { 
        text: 'Thank You!', 
        position: { x: 100, y: 100 },
        style: {
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#000000',
          backgroundColor: 'rgba(255, 255, 255, 0)',
          padding: '10px',
          borderRadius: '4px'
        }
      },
      message: { 
        text: 'Your submission was successful', 
        position: { x: 100, y: 150 },
        style: {
          fontSize: '16px',
          color: '#333333',
          backgroundColor: 'rgba(255, 255, 255, 0)',
          padding: '10px',
          borderRadius: '4px'
        }
      }
    }
  }
};