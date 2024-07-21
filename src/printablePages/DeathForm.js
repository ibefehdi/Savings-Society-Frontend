import React from 'react'
import logo from '../assets/logo1.png';
const DeathForm = React.forwardRef((props, ref) => {
    const { shareholder } = props;
    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };
    return (
        <div ref={ref} style={{ fontFamily: 'Arial, sans-serif', width: '100%', margin: 'auto', padding: '20px', border: "1px solid black" }}>
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
                    {/* <h1 style={{ margin: '0' }}>الجمعية التعاونية للادخار</h1> */}
                    <h1 style={{ margin: '0', textAlign: 'center' }}>الجمعية التعاونية لموظفي الحكومة الكويتيين (للادخار)</h1>
                </div>
            </div>

            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px', textAlign: 'right', width: '100%', margin: 'auto', padding: '5px', direction: 'rtl' }}>
                {/* Header */}
                <h1 style={{ fontSize: '28px', textAlign: 'center', fontWeight: 'bolder' }}>طلب صرف مستحقات عضو متوفي</h1>

                {/* Addressing */}
                <h1>السيد الفاضل/ رئيس مجلس الإدارة <span style={{ borderBottom: "1px solid black", paddingRight: '400px', }}>&nbsp;</span>المحترم</h1>
                <h3>تحية طيبة وبعد،</h3>

                {/* Main Content */}
                <p>
                    أتقدم لسيادتكم أنا{' '}
                    <span style={{ borderBottom: "1px solid black", paddingRight: '150px' }}>&nbsp;</span>{' '}
                    بصفتي وكيلاً عن ورثة العضو المذكورة بياناته أدناه، بموجب المستندات المقدمة لكم وهي: حصر وراثة، وتوكيل عن الورثة. لذا يرجى الإيعاز لمن يلزم بصرف جميع أرصدته من الأسهم والمدخرات بالجمعية. وتفضلوا بقبول خالص التحية.
                </p>
                {/* Details Table */}
                <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0' }}>
                    <div>
                        <p>
                            رقم العضوية:{' '}
                            {shareholder?.membersCode ? (
                                <span>{shareholder.membersCode}</span>
                            ) : (
                                <span style={{ borderBottom: "1px solid black", paddingRight: '150px' }}>&nbsp;</span>
                            )}
                        </p>
                        <p>
                            اسم العضو:{' '}
                            {shareholder?.fName ? (
                                <span style={{ fontWeight: "bold" }}>{shareholder.fName}</span>
                            ) : (
                                <span style={{ borderBottom: "1px solid black", paddingRight: '150px' }}>&nbsp;</span>
                            )}
                        </p>
                        <p>
                            اسم مقدم الطلب:{' '}
                            <span style={{ borderBottom: "1px solid black", paddingRight: '150px' }}>&nbsp;</span>
                        </p>
                    </div>
                    <div>
                        <p>التاريخ: [__/__/____]</p>
                    </div>
                </div>

                {/* Signature */}
                <p>توقيع مقدم الطلب: ______________</p>

                {/* Association Details */}
                <div style={{ borderTop: '1px solid #000', paddingTop: '10px' }}>
                    <p>بيانات من واقع سجلات الجمعية</p>
                    <p>
                        رقم العضوية:{' '}
                        {shareholder?.membersCode ? (
                            <span>{shareholder.membersCode}</span>
                        ) : (
                            <span style={{ borderBottom: "1px solid black", paddingRight: '150px' }}>&nbsp;</span>
                        )}
                    </p>
                    <p>
                        تاريخ الانتساب:{' '}
                        {shareholder?.joinDate ? (
                            <span>{formatDate(shareholder.joinDate)}</span>
                        ) : (
                            <span style={{ borderBottom: "1px solid black", paddingRight: '150px' }}>&nbsp;</span>
                        )}
                    </p>

                    {/* Financial Details Header */}
                    <p style={{ textDecoration: 'underline', fontWeight: 'bold', paddingBottom: '5px' }}>
                        بيانات من واقع سجلات الجمعية
                    </p>

                    {/* Financial Details */}
                    <table style={{ width: '100%', textAlign: 'right', direction: 'rtl', marginBottom: '0  ' }}>
                        <thead>
                            <tr>
                                <td style={{ border: '1px solid #000', fontWeight: 'bold' }}>تفاصيل المبالغ المستحقة من واقع السجلات</td>
                                <td style={{ border: '1px solid #000', fontWeight: 'bold' }}>فلس</td>
                                <td style={{ border: '1px solid #000', fontWeight: 'bold' }}>دينار</td>
                                <td style={{ border: '1px solid #000', fontWeight: 'bold' }}>ملاحظات</td>
                                {/* <td style={{ borderBottom: '1px solid #000', padding: '5px' }}>بيان الأسهم / الإدخارات</td> */}
                            </tr>
                        </thead>
                        <tbody>

                            <tr>
                                <td style={{ padding: '2px', border: '1px solid #000' }}>رصيد الأسهم</td>
                                <td style={{ padding: '2px', border: '1px solid #000' }}></td>
                                <td style={{ padding: '2px', border: '1px solid #000' }}>
                                    {shareholder?.share?.[0]?.currentAmount ?? ''}
                                </td>
                                <td style={{ padding: '2px', border: '1px solid #000' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '2px', border: '1px solid #000' }}>رصيد مدخرات</td>
                                <td style={{ padding: '2px', border: '1px solid #000' }}></td>

                                <td style={{ padding: '2px', border: '1px solid #000' }}></td>
                                <td style={{ padding: '2px', border: '1px solid #000' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '2px', border: '1px solid #000', }}> أرباح عام</td>

                                <td style={{ padding: '2px', border: '1px solid #000', }}></td>
                                <td style={{ padding: '2px', border: '1px solid #000', }}></td>
                                <td style={{ padding: '2px', border: '1px solid #000', }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '2px', border: '1px solid #000', }}>إجمالي</td>

                                <td style={{ padding: '2px', border: '1px solid #000', }}></td>
                                <td style={{ padding: '2px', border: '1px solid #000', }}>{Number(shareholder?.share?.[0]?.currentAmount ?? 0) + Number(shareholder?.savings?.totalAmount ?? 0)}</td>
                                <td style={{ padding: '2px', border: '1px solid #000', textAlign: 'right' }}>فقط</td>
                            </tr>
                        </tbody>
                    </table>


                    {/* Footer */}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p>الموظف المختص:<br /><br /> ______________</p>
                        <p>المحاسب:<br /><br /> ______________</p>
                        <p>مسئول الشئون الإدارية والمالية:<br /><br /> ______________</p>
                        <p>أمين الصندوق:<br /><br /> ______________</p>
                    </div>
                    <p>المراقب المالي:<br /><br /> وزارة الشئون الاجتماعية والعمل</p>
                    <p>حرر له شيك رقم (__________) بتاريخ [__/__/____] على بنك بيت التمويل</p>
                    <p style={{ fontWeight: 'bold' }}>رئيس مجلس الإدارة:<br /><br /> ______________</p>
                </div>
            </div>
        </div>
    );
});

export default DeathForm