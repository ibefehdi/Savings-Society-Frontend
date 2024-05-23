import React from 'react';
import logo from '../assets/logo1.png';

const CashWithdrawalVoucher = React.forwardRef((props, ref) => {
    return (
        <div ref={ref} style={formStyles}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', paddingBottom: 10, borderBottom: '1px solid black', direction: 'ltr' }}>
                <div style={{ flex: 1 }}>
                    <h1 style={{ margin: '0', textAlign: 'center' }}>Co-operative Society of Savings</h1>
                    <p style={{ margin: '0', textAlign: 'center' }}>For Kuwait Staff in Government</p>
                    <p style={{ margin: '0', textAlign: 'center' }}>Tel: 22610345 - 22641090 - Fax: 22619360</p>
                </div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    <img src={logo} alt='logo' style={{ height: '100px', width: '100px' }} />
                </div>
                <div style={{ flex: 1, textAlign: 'right' }}>
                    <h1 style={{ margin: '0', textAlign: 'center' }}>الجمعية التعاونية لموظفي الحكومة الكويتيين (للادخار)</h1>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', paddingBottom: 10, direction: 'ltr' }}>
                <div style={{ flex: 1 }}>

                </div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center'}}>
                    <h1>سند صرف مبالغ نقدية من الصندوق</h1>
                </div>
                <div style={{ flex: 1, textAlign: 'right' }}>
                </div>
            </div>
            <div style={{ textAlign: 'right' }}>
                <p>التاريخ: / / 202</p>
                <p>الموضوع:.............................................</p>
                <p>السيد/ مسئول الخزينة بالجمعية المحترم</p>
                <p>تحية طيبة .. وبعد،،</p>
                <table style={{ width: '100%', marginTop: '20px', marginBottom: '20px' }}>
                    <tbody>
                        <tr>
                            <td style={{ textAlign: 'right' }}>-</td>
                            <td style={{ textAlign: 'left' }}>دينار</td>
                        </tr>
                    </tbody>
                </table>
                <p>يرجى التكرم بالموافقة على صرف مبلغ وقدره</p>
                <p>فقط (.............................................................................................................. لاغير)</p>
                <p>وذلك لأجل..........................................................................................................................</p>
                <p>.....................................................................................................................................</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <div>
                        <p>اسم المستلم : ................................ التوقيع :................................</p>
                    </div>
                    <div>
                        <p>أمين الصندوق: ................................ التوقيع : ................................</p>
                    </div>
                </div>
                <div style={{ textAlign: 'left', marginTop: '40px' }}>
                    <p>يعتمد</p>
                    <p>مسئول الشئون الإدارية والمالية</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <p>امين الصندوق</p>
                    <p>رئيس مجلس الإدارة</p>
                </div>
            </div>
        </div>
    );
});

const formStyles = {
    fontFamily: "Arial, sans-serif",
    direction: "rtl",
    width: "100%",
    margin: "auto",
    padding: "20px",
    border: '1px solid black'
};

export default CashWithdrawalVoucher;