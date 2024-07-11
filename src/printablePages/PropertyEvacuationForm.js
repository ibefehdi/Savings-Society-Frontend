import React from 'react';
import logo from '../assets/logo1.png';

const PropertyEvacuationForm = React.forwardRef((props, ref) => {
    const { tenantDetails } = props;

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
            <h2 style={{ textAlign: 'center' }}>طلب إخلاء العين المؤجرة</h2>

            <p>السيد الفاضل/ رئيس مجلس الإدارة المحترم</p>
            <p>تحية طيبة .. وبعد،،</p>

            <p>الموضوع: طلب إخلاء العين المؤجرة</p>

            <p>
                بالإشارة إلى العقد المبرم معكم بشأن استئجاري (شقة) رقم ({tenantDetails?.apartmentNumber || '___'}) الدور ({tenantDetails?.floor || '___'}) بعمارتكم الكائنة بمنطقة ({tenantDetails?.area || '___'}) أحيطكم علما بأنني سوف أقوم بتنازلي وإخلائها لكم اعتبارا من تاريخ {tenantDetails?.evacuationDate || '___'} وأتعهد بأن ادفع الإيجارات المستحقة حتى تاريخ الإخلاء أثناء تقديمي لهذا الطلب وأتعهد بأن اسلم العين المؤجرة إلى إدارة الجمعية كما كان الوضع عليها قبل تأجيري لها خالية من الشواغل وإصلاح ما قد يكون بالعين المؤجرة من تلـف أو دفع قيمتها نقداً.
            </p>

            <p>
                كما التزم بالوفاء بكافة التزاماتي من قبل وزارة الكهرباء والماء وتزويد الجمعية ببراءة الذمة من الوزارة المذكورة عن الوفاء لها بكافة مستحقاتها دون أية مسئولية إطلاقاً على الجمعية أو على المستأجر الجديد.
            </p>

            <p>
                وفي حالة عدم التزامي بذلك يعتبر هذا الطلب لاغياً كأن لم يكن ولا يعتد به وفي هذه الحالة يكون عقد الإيجار الموقع مع الجمعية ساري المفعول وللجمعية الحق في مطالبتي بحقوقها المالية المترتبة على استمرار عقد الإيجار.
            </p>

            <p>وتفضلوا بقبول فائق التقدير والاحترام ،،،</p>

            <p>تم تسليم المفتاح للإدارة بتاريخ ___/___/____</p>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                <div>اسم المستأجر: {tenantDetails?.tenantName || '___________________'}</div>
                <div>التاريخ: {tenantDetails?.signatureDate || currentDate}</div>
                <div>توقيعه: ___________________</div>
            </div>

            <div style={{ marginTop: '30px', borderTop: '1px solid black', paddingTop: '10px' }}>
                <h3>للاستخدام الرسمي لإدارة الجمعية</h3>
                <p>_________________________________________________________________________</p>
                <p>_________________________________________________________________________</p>
                <p style={{ textAlign: 'left' }}>مسئول الشئون الإدارية والمالية</p>
                <p style={{ textAlign: 'left' }}>الأصل / ملف الشقة</p>
            </div>
        </div>
    );
});

export default PropertyEvacuationForm;