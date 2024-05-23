import React from 'react';
import logo from '../assets/logo1.png';

const CheckWithdrawalForm = React.forwardRef((props, ref) => {
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
            <div style={{ textAlign: 'right' }}>
                <h2 style={headingStyles}>استمارة صرف شيك</h2>
                <p>تحرير:    /    /    202</p>
                <p>السيد الفاضل/ رئيس مجلس الإدارة                   المحترم</p>
                <p>تحية طيبة وبعد،،،</p>
                <p>مرفق طيه شيك رقم ............................. بمبلغ       /            دينار بتاريخ    /    /</p>
                <p>المسحوب لأمر السيد / السادة .................................................. على بيت التمويل</p>
                <p>وذلك سدادا ..............................................................................................</p>
                <p>برجاء التكرم بالموافقة على التوقيع عليه</p>
                <p>وتفضلوا بقبول خالص التحية،،،</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
                    <div>
                        <p>الموظف المختص</p>
                        <p>...........................</p>
                    </div>
                    <div>
                        <p>رئيس المحاسبة</p>
                        <p>..........................</p>
                    </div>
                    <div>
                        <p>مسئول الشئون الإدارية والمالية</p>
                        <p>...................................</p>
                    </div>
                    <div>
                        <p>أمين الصندوق</p>
                        <p>........................</p>
                    </div>
                </div>
                <div style={{ textAlign: 'right', marginTop: '40px' }}>
                    <p>المراقب المالي</p>
                    <p>وزارة الشئون الاجتماعية والعمل</p>
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

const headingStyles = {
    textAlign: "center",
};

export default CheckWithdrawalForm;