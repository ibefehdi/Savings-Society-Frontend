import React from 'react';
import logo from '../assets/logo1.png';

const SharesAndSavingsForm = React.forwardRef((props, ref) => {
    return (
        <div ref={ref} style={{ fontFamily: 'Arial, sans-serif', width: '100%', margin: 'auto', padding: '20px', border: "1px solid black", direction: 'rtl' }}>
            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', paddingBottom: 10, borderBottom: '1px solid black', direction: 'ltr' }}>
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
                {/* Addressing */}
                <h1>السيد الفاضل/ رئيس مجلس الإدارة <span style={{ borderBottom: "1px solid black", paddingRight: '400px', }}>&nbsp;</span>المحترم</h1>
                <h3>تحية طيبة وبعد،،،</h3>

                {/* Main Content */}
                <p>أتقدم لسيادتكم حيث أنني عضو بالجمعية تحت رقم (<span style={{ borderBottom: "1px solid black", paddingRight: '150px', }}>&nbsp;</span>) وأرغب في زيادة عدد الأسهم وإيداع مبلغ في حسابي بالمدخرات طرفكم وهي كالتالي :</p>

                <p>1 - الأسهم بعدد (<span style={{ borderBottom: "1px solid black", paddingRight: '50px', }}>&nbsp;</span>) سهم بمبلغ: <span style={{ borderBottom: "1px solid black", paddingRight: '50px', }}>&nbsp;</span>/-<span style={{ borderBottom: "1px solid black", paddingRight: '50px', }}>&nbsp;</span> دينار (فقط<span style={{ borderBottom: "1px solid black", paddingRight: '150px', }}>&nbsp;</span> لاغير )</p>

                <p>2 - المدخرات بمبلغ : <span style={{ borderBottom: "1px solid black", paddingRight: '50px', }}>&nbsp;</span>/<span style={{ borderBottom: "1px solid black", paddingRight: '50px', }}>&nbsp;</span> دينار ( فقط <span style={{ borderBottom: "1px solid black", paddingRight: '150px', }}>&nbsp;</span> لاغير )</p>

                <p>الإجمالي : <span style={{ borderBottom: "1px solid black", paddingRight: '50px', }}>&nbsp;</span>/<span style={{ borderBottom: "1px solid black", paddingRight: '50px', }}>&nbsp;</span> دينار ( فقط <span style={{ borderBottom: "1px solid black", paddingRight: '150px', }}>&nbsp;</span>لاغير )</p>

                <p>لذا ـ يرجى الموافقة على قبول المبلغ الموضح أعلاه وتزويدي بإيصال بالاستلام.</p>

                <p>وتفضلوا بقبول خالص التحية،،،</p>

                {/* Details */}
                <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0' }}>
                    <div>
                        <p>التاريخ: [__/__/____]</p>
                        <p>اسم العضو: <span style={{ borderBottom: "1px solid black", paddingRight: '150px', }}>&nbsp;</span></p>
                        <p>توقيع مقدم الطلب: ______________</p>
                    </div>
                </div>

                {/* Association Details */}
                <div style={{ borderTop: '1px solid #000', paddingTop: '10px' }}>
                    <p>بيانات من واقع سجلات الجمعية</p>

                    {/* Financial Details */}
                    <table style={{ width: '100%', textAlign: 'right', direction: 'rtl', marginBottom: '0' }}>
                        <thead>
                            <tr>
                                <td style={{ border: '1px solid #000', fontWeight: 'bold', padding: '2px' }}>تفاصيل المبالغ المستحقة من واقع السجلات</td>
                                <td style={{ border: '1px solid #000', fontWeight: 'bold', padding: '2px' }}>فلس</td>
                                <td style={{ border: '1px solid #000', fontWeight: 'bold', padding: '2px' }}>دينار</td>
                                <td style={{ border: '1px solid #000', fontWeight: 'bold', padding: '2px' }}>ملاحظات</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ padding: '2px', border: '1px solid #000' }}>رصيد الأسهم في 31/12/2020</td>
                                <td style={{ padding: '2px', border: '1px solid #000' }}></td>
                                <td style={{ padding: '2px', border: '1px solid #000' }}></td>
                                <td style={{ padding: '2px', border: '1px solid #000' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '2px', border: '1px solid #000' }}>رصيد المدخرات في 31/12/2020</td>
                                <td style={{ padding: '2px', border: '1px solid #000' }}></td>
                                <td style={{ padding: '2px', border: '1px solid #000' }}></td>
                                <td style={{ padding: '2px', border: '1px solid #000' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '2px', border: '1px solid #000' }}>اجمالي رصيد الاسهم والمدخرات</td>
                                <td style={{ padding: '2px', border: '1px solid #000' }}></td>
                                <td style={{ padding: '2px', border: '1px solid #000' }}></td>
                                <td style={{ padding: '2px', border: '1px solid #000', textAlign: 'right' }}>فقط</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Footer */}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p>موظف المختص:<br /> .............................</p>
                        <p>رئيس المحاسبة:<br /> .............................</p>
                        <p>مسئول الشئون الإدارية والمالية:<br /> .....................................</p>
                        <p>أمين الصندوق:<br /> ...........................</p>
                    </div>
                    <p style={{ textAlign: 'left' }}>رئيس مجلس الإدارة<br /> .......................</p>
                    <p>تم استلام المبلغ بسند قبض رقم (<span style={{ borderBottom: "1px solid black", paddingRight: '50px', }}>&nbsp;</span>) بتاريخ [__/__/____] نقدأ</p>
                </div>
            </div>
        </div>
    );
});

export default SharesAndSavingsForm;