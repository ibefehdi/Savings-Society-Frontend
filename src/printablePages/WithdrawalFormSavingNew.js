import React from 'react';
import logo from '../assets/logo1.png';

const WithdrawalFormSavingNew = React.forwardRef((props, ref) => {
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
            <h2 style={{ textAlign: 'center' }}>طلب سحب رصيد الأسهم - المدخرات</h2>

            <p>السيد الفاضل/ رئيس مجلس الإدارة المحترم .</p>
            <p>تحية طيبة وبعد،،،</p>

            <p>
                أتقدم لسيادتكم حيث أنني عضو بالجمعية تحت رقم ({memberDetails?.membershipNumber || '____'}) وأرغب في سحب عدد الأسهم و مبلغ من حسابي بالمدخرات طرفكم وهي كالتالي :
            </p>

            <ol>
                <li>
                    الأسهم بعدد ({memberDetails?.sharesCount || '____'}) سهم بمبلغ: {memberDetails?.sharesAmount || '____'} دينار (فقط {memberDetails?.sharesAmountInWords || '________________'} لاغير)
                </li>
                <li>
                    المدخرات بمبلــــــغ : {memberDetails?.savingsAmount || '____'} دينار (فقط {memberDetails?.savingsAmountInWords || '________________'} لاغير)
                </li>
            </ol>

            <p>
                الإجمالي : {memberDetails?.totalAmount || '____'} دينار (فقط {memberDetails?.totalAmountInWords || '________________'} لاغير)
            </p>

            <p>لذا يرجى الموافقة على قبول صرف المبلغ الموضح أعلاه وتزويدي بشيك بالمبلغ.</p>

            <p>وتفضلوا بقبول خالص التحية،،،</p>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                <div>التاريخ: {memberDetails?.signatureDate || currentDate}</div>
                <div>اسـم العضــو: {memberDetails?.name || '___________________'}</div>
            </div>

            <div style={{ textAlign: 'left', marginTop: '10px' }}>
                <p>توقيع مقدم الطلب: ___________________</p>
            </div>

            <div style={{ marginTop: '30px', borderTop: '1px solid black', paddingTop: '10px' }}>
                <h3 style={{ backgroundColor: '#ccc', padding: '5px' }}>بيانات من واقع سجلات الجمعية</h3>

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
                            <td style={{ border: '1px solid black', padding: '5px' }}>رصيد الأسهـــــــــــم في31/12/2020</td>
                            <td style={{ border: '1px solid black', padding: '5px' }}></td>
                            <td style={{ border: '1px solid black', padding: '5px' }}>{memberDetails?.shareBalance || ''}</td>
                            <td style={{ border: '1px solid black', padding: '5px' }}></td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid black', padding: '5px' }}>رصيد المدخــرات في31/12/2020</td>
                            <td style={{ border: '1px solid black', padding: '5px' }}></td>
                            <td style={{ border: '1px solid black', padding: '5px' }}>{memberDetails?.savingsBalance || ''}</td>
                            <td style={{ border: '1px solid black', padding: '5px' }}></td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid black', padding: '5px' }}>أجمالي رصيد الأسهم والمدخرات</td>
                            <td style={{ border: '1px solid black', padding: '5px' }}></td>
                            <td style={{ border: '1px solid black', padding: '5px' }}>{memberDetails?.totalBalance || ''}</td>
                            <td style={{ border: '1px solid black', padding: '5px' }}>فقط</td>
                        </tr>
                    </tbody>
                </table>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <div>الموظف المختص</div>
                    <div>المحاسبة</div>
                    <div>مسئول الشئون الإدارية والمالية</div>
                    <div>أمين الصندوق</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <div>__________</div>
                    <div>__________</div>
                    <div>__________</div>
                    <div>__________</div>
                </div>

                <div style={{ marginTop: '20px', textAlign: 'left' }}>
                    <p>رئيس مجلس الإدارة</p>
                    <p>__________</p>
                </div>

                <p style={{ marginTop: '20px' }}>
                    تم استلام المبلغ بسند قبض رقم(______) بتاريخ __/__/____ نقدا
                </p>
            </div>
        </div>
    );
});

export default WithdrawalFormSavingNew;