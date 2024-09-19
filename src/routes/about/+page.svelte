<script lang="ts">
  import {
    instagramCircled,
    whatsappCircled,
    twitterCircled,
    emailCircled,
  } from "$lib/assets/icons";
  import { Pattern } from "$lib/components";
</script>

<div class="text-xl md:px-12" dir="rtl">
  <h1 class="text-4xl font-bold mb-6">عن رهام</h1>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-20">
    <div>
      <h2 class="text-3xl font-semibold mb-4">نبذة عن رهام</h2>
      <ul class="list-disc list-outside pr-5 space-y-2">
        <li>مدربة معتمدة من المجلس العالمي للتدريب و التدريس و الكوتشينق</li>
        <li>مدربة معتمدة من الأكاديمية العالمية للتدريب والاستشارات</li>
        <li>مدربة معتمدة من شركة فرانشايز الراشد</li>
        <li>مدربة معتمدة في التخطيط الشخصي من شركة فرانشايز الراشد</li>
        <li>مدربة شخصية معتمدة من قبل المعهد الأوربي للتدريب الشخصي ECI</li>
        <li>مرشدة معتمدة للعلاقة الزوجية من مؤسسة د مصطفى أبو سعد</li>
        <li>مرشدة معتمدة لمرحلة الطفولة من مؤسسة د مصطفى أبو سعد</li>
        <li>مؤسسة منهج رهام ديفا للأنوثة وحب الذات</li>
        <li>
          المنهج حاصل على تكريم وزارة الدواة لشؤون الشباب كواحد من أفضل 10
          مشاريع شبابية في القطاع التعليمي
        </li>
        <li>
          ربع مليون مستفيد من البرامج المجانية التي تقدمها في الوعي الأنثوي
        </li>
      </ul>
    </div>
    <div class="space-y-4">
      <h2 class="text-2xl font-semibold mb-4">معلومات الاتصال</h2>
      <p class="flex items-center">
        <img src={emailCircled} alt="Instagram" class="w-10 h-10 ml-2" />
        <a href="mailto:hello@reham.com" class="hover:underline"
          >hello@reham.com</a
        >
      </p>
      <p class="flex items-center">
        <img src={instagramCircled} alt="Instagram" class="w-10 h-10 ml-2" />
        <a href="https://www.instagram.com/rehamhouse" class="hover:underline"
          >rehamhouse@</a
        >
      </p>
      <p class="flex items-center">
        <img src={whatsappCircled} alt="WhatsApp" class="w-10 h-10 ml-2" />
        <a
          href="https://api.whatsapp.com/send/?phone=96550406406&text&type=phone_number&app_absent=0"
          class="hover:underline">واتساب</a
        >
      </p>
      <p class="flex items-center">
        <img src={twitterCircled} alt="Twitter" class="w-10 h-10 ml-2" />
        <a href="https://x.com/rehamhouse1" class="hover:underline"
          >rehamhouse</a
        >
      </p>
    </div>
  </div>
</div>
<Pattern left mdScreen/>
