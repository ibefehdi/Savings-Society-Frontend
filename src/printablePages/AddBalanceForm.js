import React from 'react';
import logo from '../assets/logo.png';

const AddBalanceForm = React.forwardRef((props, ref) => {
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
                    <p style={{ margin: '0' }}>الجمعية التعاونية لموظفي الحكومة الكويتيين (للادخار)</p>
                </div>
            </div>
            <h2 style={headingStyles}>طلب زيادة رصيد الأسهم – المدخرات</h2>
            <p style={paragraphStyles}>
                السيد الفاضل/ رئيس مجلس الإدارة المحترم<br />
                تحية طيبة وبعد،،،<br />
                أتقدم لسيادتكم حيث أنني عضو بالجمعية تحت رقم (&nbsp;__________)&nbsp; وأرغب في زيادة عدد الأسهم وإيداع مبلغ في حسابي بالمدخرات طرفكم وهي كالتالي:<br /><br />
                1 - الأسهم بعدد (&nbsp;__________)&nbsp; سهم بملغ: __________ دينار (                              ).<br /><br />
                2 - المدخرات بمبلغ: __________ دينار (                              ).<br /><br />
                الإجمالي: __________ دينار (                              ).<br /><br /><br />
                لذا يرجى الموافقة على قبول المبلغ الموضح أعلاه وتزويدي بإيصال بالاستلام.<br />
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
                        <td>ملاحظات</td>
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
                        <td>رصيد الأسهم في 31/12/{year}</td>
                        <td>__________</td>
                        <td>__________</td>
                        <td>__________</td>
                    </tr>
                    <tr>
                        <td>أجمالي رصيد الأسهم والمدخرات</td>
                        <td>__________</td>
                        <td>__________</td>
                        <td>__________</td>
                    </tr>
                </tbody>
            </table>

            <div style={signaturesStyles}>
                <div>
                    الموظف المختص<br /><br />
                    __________
                </div>
                <div>
                    المحاسب<br /><br />
                    __________
                </div>
                <div>
                    مسئول الشؤون الإدارية والمالية<br /><br />
                    __________
                </div>
                <div>
                    أمين الصندوق<br /><br />
                    __________
                </div>
            </div>
            <br />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                <p style={paragraphStyles}>
                    تم استلام المبلغ بسند قبض رقم (__________) بتاريخ ________/ نقدا<br />

                </p>
                <p className="">ئيس مجلس الإدارة
                    __________</p>
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


export default AddBalanceForm;
