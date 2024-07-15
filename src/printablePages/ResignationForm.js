import React from 'react';
import logo from '../assets/logo1.png';

const ResignationForm = React.forwardRef((props, ref) => {
    const { memberDetails } = props;

    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const currentDate = formatDate(new Date());

    return (
        <div ref={ref} style={{ fontFamily: 'Arial, sans-serif', width: '100%', margin: 'auto', padding: '20px', border: "1px solid black", direction: 'rtl' }}>
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
                    {/* <h1 style={{ margin: '0' }}>الجمعية التعاونية للادخار</h1> */}
                    <h1 style={{ margin: '0', textAlign: 'center' }}>الجمعية التعاونية لموظفي الحكومة الكويتيين (للادخار)</h1>
                </div>
            </div>
            <h2 style={{ textAlign: 'center' }}>طلب استقالة من الجمعية</h2>

            <p>السيد الفاضل/ رئيس مجلس الإدارة المحترم</p>
            <p>تحية طيبة وبعد،،،</p>

            <p>
                يرجى الموافقة على قبول استقالتي من عضوية الجمعية ، والإيعاز لمن يلزم بصرف جميع  أرصدتي من الأسهم والمدخرات حتى تاريخ : {memberDetails?.resignationDate || currentDate}
            </p>

            <p>وتفضلوا بقبول خالص التحية،،،</p>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                <div>التاريخ: {memberDetails?.signatureDate || currentDate}</div>
                <div>مقدمـــه</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <div>الرقم المدني: {memberDetails?.civilId || '___________________'}</div>
                <div>الاسـم: {memberDetails?.name || '___________________'}</div>
            </div>

            <div style={{ textAlign: 'left', marginTop: '10px' }}>
                <p>التوقيـع: ___________________</p>
            </div>

            <div style={{ marginTop: '30px', borderTop: '1px solid black', paddingTop: '10px' }}>
                <h3 style={{ backgroundColor: '#ccc', padding: '5px' }}>بيانات من واقع سجلات الجمعية</h3>
                <p>رقم العضوية: {memberDetails?.membershipNumber || '____'}</p>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid black', padding: '5px' }}>تفاصيل المبالغ المستحقة من واقع السجلات</th>
                            <th style={{ border: '1px solid black', padding: '5px' }}>فلس</th>
                            <th style={{ border: '1px solid black', padding: '5px' }}>دينــار</th>
                            <th style={{ border: '1px solid black', padding: '5px' }}>ملاحظـــــــات</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ border: '1px solid black', padding: '5px' }}>رصيد الأسهـــــــــــم</td>
                            <td style={{ border: '1px solid black', padding: '5px' }}></td>
                            <td style={{ border: '1px solid black', padding: '5px' }}>{memberDetails?.shareBalance || ''}</td>
                            <td style={{ border: '1px solid black', padding: '5px' }}></td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid black', padding: '5px' }}>رصيد المدخـــــــــرات</td>
                            <td style={{ border: '1px solid black', padding: '5px' }}></td>
                            <td style={{ border: '1px solid black', padding: '5px' }}>{memberDetails?.savingsBalance || ''}</td>
                            <td style={{ border: '1px solid black', padding: '5px' }}></td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid black', padding: '5px' }}>الإجمالي المستحق</td>
                            <td style={{ border: '1px solid black', padding: '5px' }}></td>
                            <td style={{ border: '1px solid black', padding: '5px' }}>{memberDetails?.totalDue || ''}</td>
                            <td style={{ border: '1px solid black', padding: '5px' }}>فقط</td>
                        </tr>
                    </tbody>
                </table>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <div>الموظف المختص</div>
                    <div>رئيس المحاسبة</div>
                    <div>مسئول الشئون الإدارية والمالية</div>
                    <div>أمين الصندوق</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <div>__________</div>
                    <div>__________</div>
                    <div>__________</div>
                    <div>__________</div>
                </div>

                <div style={{ marginTop: '20px' }}>
                    <p>المراقب المالي</p>
                    <p>وزارة الشئون الاجتماعية والعمل</p>
                    <p style={{ textAlign: 'left' }}>رئيس مجلس الإدارة</p>
                </div>

                <p style={{ marginTop: '20px' }}>
                    حرر له الشيك رقم (______) بتاريخ: __/__/____ على بيت التمويل
                </p>
            </div>
        </div>
    );
});

export default ResignationForm;