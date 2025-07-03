// member/privacy-policy/page.tsx

export const metadata = {
  title: '隱私權政策｜Ujie的部落格',
  description: '了解我們如何收集、使用與保護您的個人資訊。',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white text-gray-800 px-6 py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">隱私權政策</h1>

      <p className="mb-4">
        本網站（以下簡稱「本站」）尊重並保護您的隱私。為協助您了解本站如何收集、處理、使用及保護您的個人資料，特此說明本站之隱私權政策。
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">一、適用範圍</h2>
      <p className="mb-4">
        隱私權政策適用於您瀏覽本站及使用本站所提供服務時，所涉及的個人資料蒐集與使用行為。若您連結至第三方網站，則不適用本政策。
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">二、個人資料之蒐集方式與項目</h2>
      <p className="mb-4">
        當您瀏覽本站時，我們可能自動收集如下資訊以提升網站品質與使用體驗：
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>瀏覽器類型、作業系統、裝置類型</li>
        <li>IP 位址與使用地區</li>
        <li>瀏覽行為（如停留時間、點擊內容等）</li>
        <li>參考來源網站（Referrer）</li>
      </ul>
      <p className="mb-4">
        若您透過表單主動提供聯絡資訊（如姓名、電子郵件地址），本站亦可能保存該資料以提供後續服務。
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">三、資料使用目的與方式</h2>
      <p className="mb-4">
        所蒐集之資料將僅用於以下用途：
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>網站內容與服務優化</li>
        <li>統計分析與使用者行為研究</li>
        <li>個人化廣告內容投放（如使用 Google AdSense）</li>
        <li>行銷或回覆用戶查詢</li>
      </ul>
      <p className="mb-4">
        本站不會將您的個人資料提供給第三方，除非事先取得您的同意，或依法配合司法機關調查。
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">四、Cookie 使用說明</h2>
      <p className="mb-4">
        為提升服務品質，本網站會於您的電腦中寫入並讀取 Cookie。Cookie 為一種識別技術，用以記錄偏好設定、分析流量與追蹤使用者行為。
        若您不希望接受 Cookie，可透過瀏覽器進行設定，惟可能導致網站部分功能無法正常使用。
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">五、第三方服務使用</h2>
      <p className="mb-2">
        本站使用以下第三方服務，該等服務可能基於其政策收集並處理您的資料：
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>
          Google Analytics（分析網站流量與使用者行為）：
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            className="text-blue-600 underline ml-1"
          >
            隱私政策
          </a>
        </li>
        <li>
          Google AdSense（廣告投放與收益）：
          <a
            href="https://policies.google.com/technologies/ads"
            target="_blank"
            className="text-blue-600 underline ml-1"
          >
            廣告政策
          </a>
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">六、您的權利</h2>
      <p className="mb-4">
        您可隨時透過聯絡方式請求查詢、更正或刪除您的個人資料，本站將依據個人資料保護法之相關規定處理。
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">七、聯絡方式</h2>
      <p className="mb-4">
        如您對本政策有任何疑問，請來信至：<br />
        <a href="mailto:ujie@example.com" className="text-blue-600 underline">
          ujie@example.com
        </a>
      </p>

      <p className="text-sm text-gray-500 mt-10">
        本隱私權政策如有修訂，將於本頁面公告更新日期。
        <br />
        最後更新日期：{new Date().toLocaleDateString('zh-Hant')}
      </p>
    </div>
  )
}