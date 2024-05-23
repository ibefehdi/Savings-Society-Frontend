import React from 'react';
import logo from '../assets/logo1.png';

const RentPaymentNotice = React.forwardRef((props, ref) => {
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
                <p>التاريخ: 2024/4/25</p>
                <h2 style={headingStyles}>استعجال بالإيجارات المتأخرة</h2>
                <h2 style={headingStyles}>وإنذار بدفع الإيجارات</h2>
                <p>السيد/ محمد محمود طه حماده المحترم</p>
                <p>رقم مدني/ 279100904278</p>
                <p>مستأجر شقة رقم (11) عمارة رقم (3) بمنطقة (حولي)</p>
                <p>تحية طيبة وبعد،،،</p>
                <p>نحيطكم علما بأنه استحق عليكم إيجارات متأخرة عن الشهور التالية:</p>
                <p>( مارس و ابريل (2024 )</p>
                <p>لذا يرجى الإسراع في سداد الإيجارات المستحقة عليكم في موعد غايته أسبوع من تاريخه وإلا سنضطر أسفين إلى استكمال الإجراءات القانونية ضدكم لدى المحامي بالإخلاء الجبري لحفظ حقوق الجمعية وإلزامكم بجميع الأجرة المستحقة عليكم والمصروفات وأتعاب المحاماة</p>
                <p>وتفضلوا بقبول فائق الاحترام،،،</p>
                <div style={{ textAlign: 'left', marginTop: '40px' }}>
                    <p>مسئول الشئون الإدارية والمالية</p>
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

export default RentPaymentNotice;