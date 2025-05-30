import React from 'react';
import logo from '../assets/logo1.png';

const WithdrawalForm = React.forwardRef((props, ref) => {
    const { shareholder } = props;
    const year = new Date().getFullYear().toString();

    // Calculate total share amount
    const totalShareAmount = shareholder?.share?.purchases?.reduce((total, purchase) =>
        total + (purchase.currentAmount || 0), 0) || 0;

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
            <h2 style={headingStyles}>طلب صرف جزء من الاسهم</h2>
            <p style={paragraphStyles}>
                السيد الفاضل/ رئيس مجلس الإدارة المحترم<br />
                تحية طيبة وبعد،،،<br />
                يرجى التفضل بالموافقة على صرف عدد (&nbsp;
                {shareholder?.share?.purchases?.[0]?.amount || '__________'}
                &nbsp;) سهم بمبلغ {shareholder?.share?.purchases?.[0]?.currentAmount || '__________'} دينار (فقط __________ لا غير) وذلك من رصيد الأسهم طبقاً للسجلات المحاسبية طرفكم حتى نهاية السنة المالية المنتهية في 31/12/{year}.<br /><br />
                مع تحويل صافي أرباحي السنوية لحساب المدخرات علماً بأنني اطلعت على حسابي طرفكم ووجدته صحيح.<br /><br />
                وتفضلوا بقبول خالص التحية،،،
            </p>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', textAlign: 'right', direction: 'rtl' }}>
                <label style={{ width: 'auto', margin: '0 10px' }}>أسهم</label>
                <div style={{ width: '20px', height: '20px', border: '1px solid black', margin: '0 10px' }}></div>
                <label style={{ width: 'auto', margin: '0 10px' }}>مدخرات</label>
                <div style={{ width: '20px', height: '20px', border: '1px solid black', margin: '0 10px' }}></div>
            </div>
            <div style={dateSignatureStyles}>
                <div>التاريخ: <br /><br /> ________</div>
                <div>
                    اسم العضو:<br /><br />
                    {shareholder?.fName ? <span style={{ fontWeight: "bold" }}>{shareholder.fName}</span> : '__________'}
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
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>تفاصيل المبالغ المستحقة من واقع السجلات</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>فلس</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>دينار</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>ملاحظات</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>رقم العضوية {shareholder?.membersCode || '__________'} تاريخ الانتساب: {shareholder?.joinDate ? new Date(shareholder.joinDate).toLocaleDateString('ar-KW') : '__/__/____'}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>__________</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>__________</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>__________</td>
                    </tr>
                    <tr>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>رصيد الأسهم في 31/12/{year}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>__________</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{shareholder?.share?.purchases?.[0]?.currentAmount || '__________'}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>__________</td>
                    </tr>
                    <tr>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>أجمالي</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>__________</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{totalShareAmount || '__________'}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>__________</td>
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
    border: "1px solid #ddd",
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

export default WithdrawalForm;