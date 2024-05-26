import React from 'react';
import logo from '../assets/logo1.png';

const PeriodicLeaveForm = React.forwardRef((props, ref) => {
    return (
        <div ref={ref} style={{ fontFamily: 'Arial, sans-serif', width: '100%', margin: 'auto', padding: '20px', border: "1px solid black", direction: 'rtl' }}>
            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', paddingBottom: 10, borderBottom: '1px solid black' }}>
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

            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px', textAlign: 'right', width: '100%', margin: 'auto', padding: '5px', direction: 'rtl' }}>
                <h1 style={{ fontSize: '28px', textAlign: 'center', fontWeight: 'bolder' }}>نموذج طلب إجازة دورية</h1>

                {/* Addressing */}
                <h1>السيد رئيس مجلس الإدارة <span style={{ borderBottom: "1px solid black", paddingRight: '400px', }}>&nbsp;</span>المحترم</h1>
                <h3>تحية طيبة وبعد ،،،،،،</h3>

                {/* Main Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <p>الاسم: <span style={{ borderBottom: "1px solid black", paddingRight: '400px', }}>&nbsp;</span></p>
                    <p>الوظيفة: <span style={{ borderBottom: "1px solid black", paddingRight: '400px', }}>&nbsp;</span></p>
                    <p>تاريخ التعيين: <span style={{ borderBottom: "1px solid black", paddingRight: '50px', }}>&nbsp;</span>/<span style={{ borderBottom: "1px solid black", paddingRight: '50px', }}>&nbsp;</span>/<span style={{ borderBottom: "1px solid black", paddingRight: '50px', }}>&nbsp;</span></p>
                    <p>تاريخ البداية: <span style={{ borderBottom: "1px solid black", paddingRight: '50px', }}>&nbsp;</span>/<span style={{ borderBottom: "1px solid black", paddingRight: '50px', }}>&nbsp;</span>/202<span style={{ borderBottom: "1px solid black", paddingRight: '50px', }}>&nbsp;</span></p>
                    <p>تاريخ النهاية: <span style={{ borderBottom: "1px solid black", paddingRight: '50px', }}>&nbsp;</span>/<span style={{ borderBottom: "1px solid black", paddingRight: '50px', }}>&nbsp;</span>/202<span style={{ borderBottom: "1px solid black", paddingRight: '50px', }}>&nbsp;</span></p>
                    <p>مدة الإجازة: <span style={{ borderBottom: "1px solid black", paddingRight: '400px', }}>&nbsp;</span></p>
                </div>

                {/* Details */}
                <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0' }}>
                    <div>
                        <p>تاريخ تقديم الطلب: <span style={{ borderBottom: "1px solid black", paddingRight: '50px', }}>&nbsp;</span>/<span style={{ borderBottom: "1px solid black", paddingRight: '50px', }}>&nbsp;</span>/202<span style={{ borderBottom: "1px solid black", paddingRight: '50px', }}>&nbsp;</span></p>
                    </div>
                    <div>
                        <p>توقيع طالب الاجازة</p>
                    </div>
                </div>

                {/* Leave Balance */}
                <div style={{ marginTop: '20px' }}>
                    <p>رصيد الاجازة السابقة (<span style={{ borderBottom: "1px solid black", paddingRight: '100px', }}>&nbsp;</span>) حتى تاريخ <span style={{ borderBottom: "1px solid black", paddingRight: '50px', }}>&nbsp;</span>/<span style={{ borderBottom: "1px solid black", paddingRight: '50px', }}>&nbsp;</span>/<span style={{ borderBottom: "1px solid black", paddingRight: '50px', }}>&nbsp;</span></p>
                    <p>رصيد الإجازة الحالي (<span style={{ borderBottom: "1px solid black", paddingRight: '100px', }}>&nbsp;</span>) حتى تاريخ <span style={{ borderBottom: "1px solid black", paddingRight: '50px', }}>&nbsp;</span>/<span style={{ borderBottom: "1px solid black", paddingRight: '50px', }}>&nbsp;</span>/<span style={{ borderBottom: "1px solid black", paddingRight: '50px', }}>&nbsp;</span></p>
                </div>

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <p>مسئول الشئون الإدارية والمالية</p>
                    <p>رئيس مجلس الإدارة</p>
                </div>
            </div>
        </div>
    );
});

export default PeriodicLeaveForm;