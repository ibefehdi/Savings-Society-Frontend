import React from 'react';
import logo from '../assets/logo1.png';

const BoardMemberRewardForm = React.forwardRef((props, ref) => {
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
                <h2 style={headingStyles}>استمارة صرف مكافأة أعضاء مجلس الإدارة</h2>
                <p>العام 2019</p>
                <p>أقر أنا عضو مجلس الإدارة( ..................................................) بأني قد</p>
                <p>استلمت مكافأتي عن عضوية مجلس إدارة الجمعية التعاونية لموظفي الحكومة الكويتيين " للادخار" لعام 2019 والتي تبلغ قيمتها مبلغ وقدرة       /       دينار</p>
                <p>(فقط .......................................................... لاغير) وذلك وفقا للتوزيع</p>
                <p>المقترح والموافق عليه من قبل الجمعية العمومية العادية للسنة المالية 2019.</p>
                <div style={{ marginTop: '20px' }}>
                    <p>اسم العضو:…………….. </p>
                    <p>التوقيع :……………….. </p>
                    <p>التاريخ :……………….. </p>
                </div>
                <div style={{ marginTop: '20px' }}>
                    <h3>الشئون المالية :</h3>
                    <p>تم استلام السيد / عضو مجلس الإدارة المشار إليه أعلاه مكافأته بشيك</p>
                    <p>مسحوب علي بيت التمويل الكويتي رقم             المؤرخ :          /12/2020</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                        <p>الموظف المختص</p>
                        <p>رئيس المحاسبة</p>
                        <p>مسئول الشئون</p>
                        <p>الإدارية والمالية</p>
                        <p>أمين الصندوق</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p>..................</p>
                        <p>...................</p>
                        <p>.................</p>
                        <p>................</p>
                        <p>..................</p>
                    </div>
                </div>
                <div style={{ marginTop: '20px' }}>
                    <p>المراقب المالي : وزارة الشئون الاجتماعية والعمل</p>
                    <p style={{ textAlign: 'left' }}>رئيس مجلس الإدارة</p>
                    <p style={{ textAlign: 'left' }}>...........................</p>
                </div>
                <p>حررله الشيك رقم (      ) بتاريخ     /     /    على بيت التمويل</p>
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

export default BoardMemberRewardForm;