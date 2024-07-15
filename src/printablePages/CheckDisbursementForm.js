import React from 'react';
import logo from '../assets/logo1.png';

const CheckDisbursementForm = React.forwardRef((props, ref) => {
    const { checkDetails } = props;

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
            <h2 style={{ textAlign: 'center' }}>استمارة صرف شيــــــــــــــــكات</h2>

            <p>تحرير : {currentDate}</p>

            <p>السيد الفاضل/ رئيس مجلس الإدارة المحترم .</p>
            <p>تحية طيبة وبعد،،،</p>

            <p>
                مرفق طيه شيك رقم {checkDetails?.checkNumber || '_________'} بمبلغ وقدره {checkDetails?.amount || '_________'} دينار المؤرخ {checkDetails?.date || '_________'}
            </p>

            <p>
                المسحوب لأمر السيد/ {checkDetails?.payeeName || '___________________'} على بيت التمويل
            </p>

            <p>
                وذلك سداداً {checkDetails?.reason || '___________________'}
            </p>

            <p>برجاء التكرم بالموافقة على التوقيع عليه .</p>

            <p>وتفضلوا بقبول خالص التحية،،،</p>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '50px', borderTop: '1px solid black', paddingTop: '10px' }}>
                <div>الموظف المختص</div>
                <div>رئيس المحاسبة</div>
                <div>مسئول الشئون الإدارية والمالية</div>
                <div>أمين الصندوق</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                <div>__________</div>
                <div>__________</div>
                <div>__________</div>
                <div>__________</div>
            </div>

            <div style={{ marginTop: '30px' }}>
                <p>المراقب المالي</p>
                <p>وزارة الشئون الاجتماعية</p>
            </div>

            <div style={{ textAlign: 'left', marginTop: '30px' }}>
                <p>رئيس مجلس الإدارة</p>
                <p>__________</p>
            </div>
        </div>
    );
});

export default CheckDisbursementForm;