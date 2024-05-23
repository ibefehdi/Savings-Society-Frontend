import React from 'react';
import logo from '../assets/logo1.png';

const ReturnFromLeaveNotice = React.forwardRef((props, ref) => {
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
                <h2 style={headingStyles}>إشعار عودة من إجازة</h2>
                <p>السيد رئيس مجلس الإدارة المحترم</p>
                <p>تحية طيبة وبعد ،،،،،،</p>
                <p>ذهب المذكور في إجازة دورية / خاصة</p>
                <p>عدد مدفوعة / غير مدفوعة (الراتب)</p>
                <p>الاسم : ................................................</p>
                <p>الوظيفة : ................................................</p>
                <p>من / / 202 إلى: / / 202</p>
                <p>ومدتها يوماً</p>
                <p>وقد باشر عمله بتاريخ: / / 202</p>
                <p>أيام الانقطاع بعد الإجازة الممنوحة:</p>
                <p>( ) تحسب من رصيد الاجازات</p>
                <p>( ) تخصم من الراتب</p>
                <div style={{ textAlign: 'left', marginTop: '20px' }}>
                    <p>توقيع الموظف</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
                    <p>مسئول الشئون الإدارية والمالية</p>
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

export default ReturnFromLeaveNotice;