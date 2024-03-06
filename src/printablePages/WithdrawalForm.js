import React from 'react';
import logo from '../assets/logo.png';

const WithdrawalForm = React.forwardRef((props, ref) => {
    const year = new Date().getFullYear().toString();
    return (
        <div ref={ref} style={formStyles}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', paddingBottom: 10, borderBottom: '1px solid black', direction: 'ltr' }}>
                <div style={{ flex: 1 }}>
                    <h2 style={{ margin: '0' }}>Co-operative Society of Savings</h2>
                    <p style={{ margin: '0' }}>For Kuwait Staff in Government</p>
                    <p style={{ margin: '0' }}>Tel: 22610345 - 22641090 - Fax: 22619360</p>
                </div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    <img src={logo} alt='logo' style={{ height: '100px', width: '100px' }} />
                </div>
                <div style={{ flex: 1, textAlign: 'right' }}>
                    <h3 style={{ margin: '0' }}>الجمعية التعاونية للادخار</h3>
                    <p style={{ margin: '0' }}>الجمعية التعاونية لموظفي الحكومة الكويتيين (للادخار)</p>
                </div>
            </div>
            <h2 style={headingStyles}>طلب صرف جزء من الاسهم</h2>
            <p style={paragraphStyles}>
                السيد الفاضل/ رئيس مجلس الإدارة المحترم<br />
                تحية طيبة وبعد،،،<br />
                يرجى التفضل بالموافقة على صرف عدد (&nbsp;__________)&nbsp; سهم بمبلغ __________ دينار (فقط __________ لا غير) وذلك من رصيد الأسهم طبقاً للسجلات المحاسبية طرفكم حتى نهاية السنة المالية المنتهية في 31/12/________.<br /><br />
                مع تحويل صافي أرباحي السنوية لحساب المدخرات علماً بأنني اطلعت على حسابي طرفكم ووجدته صحيح.<br /><br />
                وتفضلوا بقبول خالص التحية،،،
            </p>

            <div style={dateSignatureStyles}>
                <div>التاريخ: <br /><br /> ________</div>
                <div>
                    اسم العضو:<br /><br />
                    __________
                </div>
                <div>
                    توقيع موقع الطلب:<br /><br />
                    __________
                </div>
            </div>
            <h3 style={heading2Styles}>بيانات من واقع سجلات الجمعية</h3>
            <table style={tableStyles}>
                <thead>
                    <tr>
                        <th>تفاصيل المبالغ المستحقة من واقع السجلات</th>
                        <th>فلس</th>
                        <th>دينار</th>
                        <th>ملاحظات</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>رقم العضوية __________ تاريخ الانتساب: __/__/____</td>
                        <td>__________</td>
                        <td>__________</td>
                        <td>__________</td>
                    </tr>
                    <tr>
                        <td>رصيد الأسهم في 31/12/{year}</td>
                        <td>__________</td>
                        <td>__________</td>
                        <td>__________</td>
                    </tr>
                    <tr>
                        <td>أجمالي</td>
                        <td>__________</td>
                        <td>__________</td>
                        <td>__________</td>
                    </tr>
                </tbody>
            </table>

            <div style={signaturesStyles}>
                <div>الموظف المختص<br /><br />__________</div>
                <div>المحاسب<br /><br />__________</div>
                <div>مسئول الشؤون الإدارية والمالية<br /><br />__________</div>
                <div>أمين الصندوق<br /><br />__________</div>
            </div>
            <br /><br /><br /><br />
            <div style={{ textAlign: 'right', marginTop: '20px', display: 'flex' }}>
                <p>المراقب المالي: وزارة الشؤون الاجتماعية والعمل<br /><br />__________</p>
                <p>حُرِّرَ له شيك رقم (__________) بتاريخ __/__/____ على بنك بيت التمويل<br /><br />رئيس مجلس الإدارة ________</p>
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

const paragraphStyles = {
    textAlign: "justify",
};
const tableStyles = {
    borderCollapse: "collapse",
    width: "100%",
    margin: "auto",
    marginTop: "20px",
    border: "1px solid #ddd", // Add this line
    textAlign: "right",
};

const dateSignatureStyles = {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "40px",
};

const heading2Styles = {
    textAlign: "center",
    marginTop: "60px",
};

const signaturesStyles = {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "40px",
};

export default WithdrawalForm