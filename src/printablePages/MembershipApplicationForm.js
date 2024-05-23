import React from 'react';
import logo from '../assets/logo1.png';

const MembershipApplicationForm = React.forwardRef((props, ref) => {
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
            <div style={headerStyles}>
                <h2 style={titleStyles}>طلب انتساب الجمعية</h2>
            </div>

            <div style={addresseeStyles}>
                <p>السيد الفاضل/ رئيس مجلس الإدارة</p>
                <p style={{ marginTop: '-10px' }}>المحترم</p>
                <p>تحية طيبة وبعد،،،</p>
            </div>

            <p style={paragraphStyles}>
                ارجوا قبولي عضوا بالجمعية التعاونية لموظفي الحكومة الكويتيين للادخار، وفقا لنظامها الأساسي بعد إن تم اطلاعي عليه.
            </p>

            <ol style={listStyles}>
                <li>رسم انتساب : مبلــــــــــــغ :- /1 د.ك</li>
                <li>اسهـم : بعدد خمسة أسهم (5 ) بقيمة : 10 د.ك ( بواقع دينارين لكل سهم ).</li>
            </ol>

            <p style={paragraphStyles}>الإجمالــــــــــــــــــــــــــــــــــــــــــــــــــــي -/11 د.ك ( احدى عشر دينار لاغير )</p>

            <div style={formFieldsContainer}>
                <div style={formFieldStyle}>
                    <span>الاسم:.................................................</span>
                    <span>الرقم المدني:......................................</span>
                </div>

                <div style={formFieldStyle}>
                    <span>جهة العمل:..............................................</span>
                    <span>الوظيفة:.............................................</span>
                </div>

                <p style={formFieldStyle}>الهاتف النقال:...........................................</p>

                <div style={formFieldStyle}>
                    <span>العنوان: منطقة ( )</span>
                    <span>ق ( )</span>
                    <span>ش ( )</span>
                    <span>ج ( )</span>
                    <span>المنزل  ( )</span>
                </div>

                <div style={formFieldStyle}>
                    <span>صندوق بريدي رقم:.............................</span>
                    <span>منطقة:.............................</span>
                    <span>رمز بريدي:........................</span>
                </div>

                <p style={formFieldStyle}>البريد الالكتروني:.................................................................</p>
            </div>

            <div style={signatureStyles}>
                <p>توقيع العضو</p>
                <p>..................</p>
            </div>

            <div style={footerContainer}>
                <div style={managementApprovalStyles}>
                    <p>اعتماد الإدارة</p>
                    <p>ملاحظات خاصة بإدارة الجمعية</p>
                </div>

                <ol style={footerListStyles}>
                    <li>رقم العضوية ( ).</li>
                    <li>موافقة مجلس الإدارة في جلسة رقم ( ) بتاريخ / / 202</li>
                    <li>رقم سند القبض تاريخ: / / 202</li>
                </ol>
            </div>
        </div>
    );
});

const formStyles = {
    fontFamily: "Arial, sans-serif",
    width: "100%",
    margin: "auto",
    padding: "20px",
    border: '2px solid black',
    fontSize: '14px',
    direction: "rtl"
};

const headerStyles = {
    textAlign: 'center',
    borderBottom: '2px solid black',
    marginBottom: '10px',
    paddingBottom: '10px'
};

const titleStyles = {
    margin: '0'
};

const addresseeStyles = {
    textAlign: 'right',
    marginBottom: '20px'
};

const paragraphStyles = {
    textAlign: 'right'
};

const listStyles = {
    textAlign: 'right',
    marginRight: '30px'
};

const formFieldsContainer = {
    marginTop: '20px',
    marginBottom: '40px'
};

const formFieldStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '5px'
};

const signatureStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: '40px'
};

const footerContainer = {
    display: 'flex',
    justifyContent: 'space-between'
};

const managementApprovalStyles = {
    textAlign: 'right'
};

const footerListStyles = {
    textAlign: 'right',
    marginRight: '30px'
};

export default MembershipApplicationForm;