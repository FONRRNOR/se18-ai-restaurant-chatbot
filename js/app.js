document.addEventListener("DOMContentLoaded", () => {

    // 1. ค่าเริ่มต้นพื้นฐาน และรหัสผ่านยืนยันสิทธิ์
    const DEFAULT_CONFIG = {
        cloudflareUrl: "https://spoke-vessel-funeral-commitment.trycloudflare.com",
        restaurantId: "7c4e8a21-6f35-4b92-a1d7-5e8c3f204b69",
        tableNumber: "01",
    };

    const ACCESS_KEY = "fornor4056";

    // 2. ดึงค่า URL จาก LocalStorage
    let activeCloudflareUrl =
        localStorage.getItem("override_cloudflare_url") ||
        DEFAULT_CONFIG.cloudflareUrl;

    const demoButton = document.getElementById("liveDemoBtn");
    const qrContainer = document.getElementById("qrcode");
    const adminPanel = document.getElementById("adminPanel");
    const toggleAdminBtn = document.getElementById("toggleAdminBtn");
    const closeAdminBtn = document.getElementById("closeAdminBtn");

    // Elements สำหรับการปลดล็อกด้วยรหัสผ่านในหน้าเว็บ
    const passcodeContainer = document.getElementById("passcodeContainer");
    const urlConfigContainer = document.getElementById("urlConfigContainer");
    const adminPasscodeInput = document.getElementById("adminPasscodeInput");
    const unlockAdminBtn = document.getElementById("unlockAdminBtn");
    const customUrlInput = document.getElementById("customUrlInput");
    const saveUrlBtn = document.getElementById("saveUrlBtn");
    const resetUrlBtn = document.getElementById("resetUrlBtn");

    // 3. ฟังก์ชันสร้างเป้าหมาย URL พร้อมวาด QR Code ใหม่
    function renderTargetUrls(baseUrl) {
        const cleanBaseUrl = baseUrl.replace(/\/+$/, "");

        const targetOrderUrl =
            `${cleanBaseUrl}/customer/menu/mobile?restaurantId=${DEFAULT_CONFIG.restaurantId}&tableId=${DEFAULT_CONFIG.tableNumber}`;

        if (demoButton) {
            demoButton.href = targetOrderUrl;
        }

        if (qrContainer && typeof QRCode !== "undefined") {
            qrContainer.innerHTML = "";

            new QRCode(qrContainer, {
                text: targetOrderUrl,
                width: 125,
                height: 125,
                colorDark: "#18181b",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.M,
            });
        }
    }

    // เรียกทำงานครั้งแรก
    renderTargetUrls(activeCloudflareUrl);

    if (customUrlInput) {
        customUrlInput.value = activeCloudflareUrl;
    }

    // 4. สลับการแสดงผล Admin Panel
    if (toggleAdminBtn && adminPanel) {
        toggleAdminBtn.addEventListener("click", () => {
            adminPanel.classList.toggle("hidden");
        });
    }

    if (closeAdminBtn && adminPanel) {
        closeAdminBtn.addEventListener("click", () => {
            adminPanel.classList.add("hidden");
        });
    }

    // 5. ปลดล็อกแผงตั้งค่า
    if (unlockAdminBtn && adminPasscodeInput) {
        const handleUnlock = () => {
            const enteredKey = adminPasscodeInput.value.trim();

            if (enteredKey === ACCESS_KEY) {
                passcodeContainer.classList.add("hidden");
                urlConfigContainer.classList.remove("hidden");
                adminPasscodeInput.value = "";

                if (customUrlInput) {
                    customUrlInput.focus();
                }
            } else {
                alert("รหัสผ่านไม่ถูกต้อง ไม่อนุญาตให้เข้าถึงการตั้งค่า");
                adminPasscodeInput.value = "";
                adminPasscodeInput.focus();
            }
        };

        unlockAdminBtn.addEventListener("click", handleUnlock);

        adminPasscodeInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                handleUnlock();
            }
        });
    }

    // 6. บันทึก URL ใหม่
    if (saveUrlBtn && customUrlInput) {
        saveUrlBtn.addEventListener("click", () => {
            const newUrl = customUrlInput.value.trim();

            if (!newUrl) {
                alert("กรุณากรอก URL ก่อนบันทึก");
                return;
            }

            localStorage.setItem("override_cloudflare_url", newUrl);
            activeCloudflareUrl = newUrl;
            renderTargetUrls(newUrl);

            alert("บันทึก URL สำเร็จ ปุ่ม Demo และ QR Code อัปเดตเรียบร้อยแล้ว");
            adminPanel.classList.add("hidden");
        });
    }

    // 7. รีเซ็ตกลับเป็นค่า Default
    if (resetUrlBtn && customUrlInput) {
        resetUrlBtn.addEventListener("click", () => {
            localStorage.removeItem("override_cloudflare_url");

            activeCloudflareUrl = DEFAULT_CONFIG.cloudflareUrl;
            customUrlInput.value = DEFAULT_CONFIG.cloudflareUrl;

            renderTargetUrls(DEFAULT_CONFIG.cloudflareUrl);

            alert("รีเซ็ตค่ากลับเป็น URL เริ่มต้นเรียบร้อยแล้ว");
            adminPanel.classList.add("hidden");
        });
    }
});