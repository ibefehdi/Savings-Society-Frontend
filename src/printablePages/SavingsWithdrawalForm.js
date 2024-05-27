import React from 'react';
import logo from '../assets/logo1.png';

const SavingsWithdrawalForm = React.forwardRef((props, ref) => {
    const { shareholder } = props;
    const currentDate = new Date().toLocaleDateString();
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
                <h1 style={{ fontSize: '28px', textAlign: 'center', fontWeight: 'bolder' }}>طلب صرف رصيد المدخرات ( كل / جزء )</h1>

                {/* Addressing */}
                <h1>السيد الفاضل رئيس مجلس الإدارة <span style={{ borderBottom: "1px solid black", paddingRight: '400px', }}>&nbsp;</span>المحترم</h1>
                <h3>تحية طيبة وبعد،،،</h3>

                {/* Main Content */}
                <p>
                    يرجى التفضل بالموافقة على صرف مبلغ{' '}
                    {shareholder?.savings?.currentAmount ? (
                        <>
                            <span>{shareholder.savings.currentAmount.toFixed(3)}</span>/<span>{shareholder.savings.currentAmount.toFixed(3)}</span> د.ك ( فقط
                            <span>{shareholder.savings.currentAmount.toFixed(3)}</span>)
                        </>
                    ) : (
                        <>
                            <span style={{ borderBottom: "1px solid black", paddingRight: '50px' }}>&nbsp;</span>/
                            <span style={{ borderBottom: "1px solid black", paddingRight: '50px' }}>&nbsp;</span> د.ك ( فقط
                            <span style={{ borderBottom: "1px solid black", paddingRight: '150px' }}>&nbsp;</span>)
                        </>
                    )}
                </p>

                <p>
                    من رصيد مدخراتي طبقا للسجلات المحاسبية طرفكم في{' '}
                    <span style={{ borderBottom: "1px solid black", paddingRight: '50px' }}>&nbsp;</span>/
                    <span style={{ borderBottom: "1px solid black", paddingRight: '50px' }}>&nbsp;</span>/
                    <span style={{ borderBottom: "1px solid black", paddingRight: '50px' }}>{currentDate}</span> م، مع تحويل صافي إرباحي
                </p>
                <p>عن الاعوام القادمة لحساب المدخرات، علما بأنني اطلعت على حسابي طرفكم ووجدته صحيح</p>

                <p>وتفضلوا بقبول خالص التحية،،،</p>

                {/* Details */}
                <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0' }}>
                    <div>
                        <p>
                            اسم العضو:{' '}
                            {shareholder?.fName ? (
                                <span>{shareholder.fName}</span>
                            ) : (
                                <span style={{ borderBottom: "1px solid black", paddingRight: '150px' }}>&nbsp;</span>
                            )}
                        </p>
                        <p>التوقيع: <span style={{ borderBottom: "1px solid black", paddingRight: '150px' }}>&nbsp;</span></p>
                    </div>
                </div>
                {/* Association Details */}
                <div style={{ borderTop: '1px solid #000', paddingTop: '10px' }}>
                    <p>بيانات من واقع سجلات الجمعية</p>
                    <p>
                        رقم العضوية:{' '}
                        {shareholder?.membersCode ? (
                            <span>{shareholder.membersCode}</span>
                        ) : (
                            <span style={{ borderBottom: "1px solid black", paddingRight: '50px' }}>&nbsp;</span>
                        )}{' '}
                        نوع الحساب: (<span style={{ borderBottom: "1px solid black", paddingRight: '100px' }}>&nbsp;</span>) تاريخ الانتساب:{' '}
                        {shareholder?.joinDate ? (
                            <span>{new Date(shareholder.joinDate).toLocaleDateString()}</span>
                        ) : (
                            <>
                                <span style={{ borderBottom: "1px solid black", paddingRight: '50px' }}>&nbsp;</span>/
                                <span style={{ borderBottom: "1px solid black", paddingRight: '50px' }}>&nbsp;</span>/
                                <span style={{ borderBottom: "1px solid black", paddingRight: '50px' }}>&nbsp;</span>
                            </>
                        )}
                    </p>
                    {/* Financial Details */}
                    <table style={{ width: '100%', textAlign: 'right', direction: 'rtl', marginBottom: '0' }}>
                        <thead>
                            <tr>
                                <td style={{ padding: '2px', border: '1px solid #000' }}>
                                    1. رصيد المدخرات في{' '}
                                    {shareholder?.savings?.lastUpdateDate ? (
                                        <span>{new Date(shareholder.savings.lastUpdateDate).toLocaleDateString()}</span>
                                    ) : (
                                        <>
                                            <span style={{ borderBottom: "1px solid black", paddingRight: '50px' }}>&nbsp;</span>/
                                            <span style={{ borderBottom: "1px solid black", paddingRight: '50px' }}>&nbsp;</span>
                                        </>
                                    )}
                                </td>
                                <td style={{ padding: '2px', border: '1px solid #000' }}>
                                    {shareholder?.savings?.currentAmount ?? ''}
                                </td>
                                <td style={{ border: '1px solid #000', fontWeight: 'bold', padding: '2px' }}>دينار</td>
                                <td style={{ border: '1px solid #000', fontWeight: 'bold', padding: '2px' }}>ملاحظات</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ padding: '2px', border: '1px solid #000' }}>1. رصيد المدخرات في <span style={{ borderBottom: "1px solid black", paddingRight: '50px', }}>&nbsp;</span>/<span style={{ borderBottom: "1px solid black", paddingRight: '50px', }}>&nbsp;</span></td>
                                <td style={{ padding: '2px', border: '1px solid #000' }}></td>
                                <td style={{ padding: '2px', border: '1px solid #000' }}></td>
                                <td style={{ padding: '2px', border: '1px solid #000' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '2px', border: '1px solid #000' }}>2. أرباح عام 2013</td>
                                <td style={{ padding: '2px', border: '1px solid #000' }}></td>
                                <td style={{ padding: '2px', border: '1px solid #000' }}></td>
                                <td style={{ padding: '2px', border: '1px solid #000' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '2px', border: '1px solid #000' }}>3. أرباح عام 2014</td>
                                <td style={{ padding: '2px', border: '1px solid #000' }}></td>
                                <td style={{ padding: '2px', border: '1px solid #000' }}></td>
                                <td style={{ padding: '2px', border: '1px solid #000' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '2px', border: '1px solid #000' }}>4. أرباح عام 2015</td>
                                <td style={{ padding: '2px', border: '1px solid #000' }}></td>
                                <td style={{ padding: '2px', border: '1px solid #000' }}></td>
                                <td style={{ padding: '2px', border: '1px solid #000' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '2px', border: '1px solid #000' }}>5. أرباح عام 2016</td>
                                <td style={{ padding: '2px', border: '1px solid #000' }}></td>
                                <td style={{ padding: '2px', border: '1px solid #000' }}></td>
                                <td style={{ padding: '2px', border: '1px solid #000' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '2px', border: '1px solid #000' }}>6. أرباح عام 2017</td>
                                <td style={{ padding: '2px', border: '1px solid #000' }}></td>
                                <td style={{ padding: '2px', border: '1px solid #000' }}></td>
                                <td style={{ padding: '2px', border: '1px solid #000' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '2px', border: '1px solid #000' }}>الاجمالي</td>
                                <td style={{ padding: '2px', border: '1px solid #000' }}></td>
                                <td style={{ padding: '2px', border: '1px solid #000' }}></td>
                                <td style={{ padding: '2px', border: '1px solid #000' }}></td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Footer */}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p>الموظف المختص:<br /> .............................</p>
                        <p>رئيس المحاسبة:<br /> .............................</p>
                        <p>مسئول الشئون الإدارية والمالية:<br /> .....................................</p>
                        <p>أمين الصندوق:<br /> ...........................</p>
                    </div>
                    <p>المراقب المالي /وزارة الشئون الاجتماعية والعمل</p>
                    <p style={{ textAlign: 'left' }}>رئيس مجلس الإدارة</p>
                    <p>حرر له الشبك رقم (<span style={{ borderBottom: "1px solid black", paddingRight: '100px', }}>&nbsp;</span>) بتاريخ: <span style={{ borderBottom: "1px solid black", paddingRight: '50px', }}>&nbsp;</span>/<span style={{ borderBottom: "1px solid black", paddingRight: '50px', }}>&nbsp;</span>/<span style={{ borderBottom: "1px solid black", paddingRight: '50px', }}>&nbsp;</span> على بيت التمويل</p>
                </div>
            </div>
        </div>
    );
});

export default SavingsWithdrawalForm;