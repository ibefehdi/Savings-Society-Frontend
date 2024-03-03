import React from 'react'
import logo from '../assets/logo.png';
const MoneyForm = React.forwardRef((props, ref) => {
    return (
        <div ref={ref} style={{ fontFamily: 'Arial, sans-serif', width: '100%', margin: 'auto', padding: '50px', border: '1px solid black' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
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

            <div style={{ borderTop: '2px solid black', borderBottom: '1px solid black', padding: '10px 0', marginBottom: '20px', textAlign: 'right', direction: 'rtl' }}>
                <p style={{ margin: '0' }}>رقم الإيصال: ________________ التاريخ: ____/____/________</p>
            </div>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', textAlign: 'center', direction: 'rtl' }}>
                <label style={{ width: 'auto', fontWeight: 'bolder', textDecoration: 'underline', fontSize: 28 }}>سند قبض</label>
            </div>
            {/* <!-- Membership Number --> */}
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end', textAlign: 'right', direction: 'rtl' }}>
                <label style={{ width: 'auto' }}>رقم العضوية:</label>
                <div style={{ flexGrow: 1, borderBottom: '1px solid black', margin: '0 10px' }}>&nbsp;</div>
            </div>
            {/* <!-- Name --> */}
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end', textAlign: 'right', direction: 'rtl' }}>
                <label style={{ width: 'auto' }}>الاسم:</label>
                <div style={{ flexGrow: 1, borderBottom: '1px solid black', margin: '0 10px' }}>&nbsp;</div>
            </div>
            {/* <!-- Civil ID Number --> */}
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end', textAlign: 'right', direction: 'rtl' }}>
                <label style={{ width: 'auto' }}>رقم البطاقة المدنية:</label>
                <div style={{ flexGrow: 1, borderBottom: '1px solid black', margin: '0 10px' }}>&nbsp;</div>
            </div>
            {/* <!-- Subscription Amount --> */}
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end', textAlign: 'right', direction: 'rtl' }}>
                <label style={{ width: 'auto' }}>مبلغ و قدره:</label>
                <div style={{ flexGrow: 1, borderBottom: '1px solid black', margin: '0 10px' }}>&nbsp;</div>
            </div>
            {/* <!-- Payment Method --> */}
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end', textAlign: 'right', direction: 'rtl' }}>
                <label style={{ width: 'auto' }}>نقدا/ شيك رقم:</label>
                <div style={{ flexGrow: 1, borderBottom: '1px solid black', margin: '0 10px' }}>&nbsp;</div>
                <label style={{ width: 'auto' }}>على بنك:</label>
                <div style={{ flexGrow: 1, borderBottom: '1px solid black', margin: '0 10px' }}>&nbsp;</div>
            </div>
            {/* <!-- Notes --> */}
            <div style={{ marginBottom: '20px', textAlign: 'right' }}>
                <label style={{ width: 'auto' }}>ملاحظات:</label>
                <div style={{ display: 'block', borderBottom: '1px dashed black', width: '100%', height: '100px', marginTop: '0px' }}>&nbsp;</div>
            </div>
            {/* <!-- Signatures --> */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', marginBottom: '10px', direction: 'rtl' }}>
                <div style={{ textAlign: 'left', width: '40%' }}>
                    <label style={{ width: 'auto' }}>المستلم:</label>
                    <div style={{ display: 'inline-block', borderBottom: '1px dashed black', width: '200px', marginLeft: '10px' }}>&nbsp;</div>
                </div>
                <div style={{ width: '70%' }}>.</div>
                <div style={{ textAlign: 'right', width: '40%' }}>
                    <label style={{ width: 'auto' }}>التوقيع:</label>
                    <div style={{ display: 'inline-block', borderBottom: '1px dashed black', width: '200px', marginRight: '10px' }}>&nbsp;</div>
                </div>
            </div>
        </div>
    );
});

export default MoneyForm