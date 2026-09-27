document.addEventListener("DOMContentLoaded", () => {
    // 1. ค่าเริ่มต้นพื้นฐาน
    const DEFAULT_CONFIG = {
        cloudflareUrl: "https://spoke-vessel-funeral-commitment.trycloudflare.com",
        restaurantId: "e8c56271-419b-4c4c-8119-df41846cfa82",
        tableNumber: "01",
    };

    // 2. ดึงค่า URL จาก LocalStorage (ถ้าเคยแก้ไขผ่านหน้าเว็บ ระบบจะจำค่าเดิมไว้)
    let activeCloudflareUrl =
        localStorage.getItem("override_cloudflare_url") ||
        DEFAULT_CONFIG.cloudflareUrl;

    const demoButton = document.getElementById("liveDemoBtn");
    const qrContainer = document.getElementById("qrcode");
    const adminPanel = document.getElementById("adminPanel");
    const toggleAdminBtn = document.getElementById("toggleAdminBtn");
    const customUrlInput = document.getElementById("customUrlInput");
    const saveUrlBtn = document.getElementById("saveUrlBtn");
    const resetUrlBtn = document.getElementById("resetUrlBtn");

    // 3. ฟังก์ชันสร้างเป้าหมาย URL พร้อมวาด QR Code ใหม่
    function renderTargetUrls(baseUrl) {
        const cleanBaseUrl = baseUrl.replace(/\/+$/, "");
        const targetOrderUrl = `${cleanBaseUrl}/customer/menu/mobile?restaurantId=${DEFAULT_CONFIG.restaurantId}&tableId=${DEFAULT_CONFIG.tableNumber}`;

        // ผูกลิงก์กับปุ่มกดเข้าสู่หน้าร้าน
        if (demoButton) {
            demoButton.href = targetOrderUrl;
        }

        // สร้าง QR Code ใหม่ลงในกล่อง #qrcode
        if (qrContainer) {
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

    // 4. สลับการแสดงผล Admin Drawer
    if (toggleAdminBtn && adminPanel) {
        toggleAdminBtn.addEventListener("click", () => {
            adminPanel.classList.toggle("hidden");
        });
    }

    // 5. บันทึก URL ใหม่ (ไม่ต้อง Deploy ใหม่)
    if (saveUrlBtn && customUrlInput) {
        saveUrlBtn.addEventListener("click", () => {
            const newUrl = customUrlInput.value.trim();
            if (newUrl) {
                localStorage.setItem("override_cloudflare_url", newUrl);
                activeCloudflareUrl = newUrl;
                renderTargetUrls(newUrl);
                alert(
                    "บันทึก URL สำเร็จ! ปุ่มและ QR Code อัปเดตไปยัง Tunnel ใหม่เรียบร้อยแล้ว",
                );
                adminPanel.classList.add("hidden");
            }
        });
    }

    // 6. รีเซ็ตกลับเป็นค่า Default
    if (resetUrlBtn && customUrlInput) {
        resetUrlBtn.addEventListener("click", () => {
            localStorage.removeItem("override_cloudflare_url");
            activeCloudflareUrl = DEFAULT_CONFIG.cloudflareUrl;
            customUrlInput.value = DEFAULT_CONFIG.cloudflareUrl;
            renderTargetUrls(DEFAULT_CONFIG.cloudflareUrl);
            alert("รีเซ็ตค่าเป็น URL เริ่มต้นแล้ว");
            adminPanel.classList.add("hidden");
        });
    }
});
