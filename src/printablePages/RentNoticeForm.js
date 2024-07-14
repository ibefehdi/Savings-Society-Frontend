import React from 'react';
import logo from '../assets/logo1.png';

const RentNoticeForm = React.forwardRef((props, ref) => {
    const { tenant } = props;

    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const currentDate = formatDate(new Date());

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
                {/* Date */}
                <p style={{ textAlign: 'right', fontWeight: 'bold' }}>التاريخ : {currentDate}</p>

                {/* Title */}
                <h2 style={{ textAlign: 'center' }}>إنــذار بدفــع الإيجـارات المتأخرة</h2>

                {/* Tenant Details */}
                <p>
                    السيد الفاضل/ {tenant?.name || '_________________'}                المحترم<br />
                    رقم مدني/ {tenant?.civilId || '_________________'}<br />
                    مستأجر {tenant?.propertyType || '___'} رقم ({tenant?.propertyNumber || '__'}) عمارة رقم ({tenant?.buildingNumber || '__'})  بمنطقة ({tenant?.area || '______'})
                </p>

                {/* Body */}
                <p>تحية طيبة وبعد،،،</p>
                <p>نحيطكم علما بأنه استحق عليكم إيجار شهر ({tenant?.dueMonths || '___________________'})</p>

                <p>
                    لذا يرجى الإسراع في سداد الإيجارات المستحقة عليكم في موعد غايته أسبوع من تاريخه وإلا سنضطر أسفين إلى اتخاذ الإجراءات القانونية ضدكم لحفظ حقوق الجمعية وإلزامكم بجميع الأجرة المستحقة عليكم والمصروفات وأتعاب المحاماة .
                </p>

                <p>وتفضلوا بقبول فائق الاحترام،،،</p>

                {/* Signature */}
                <p style={{ marginTop: '50px' }}>مسئول الشئون الإدارية والمالية</p>
            </div>
        </div>
    );
});

export default RentNoticeForm;