2023 1. dönem TÜBİTAK 2209-A projemin kaynak kodudur. Projenin amacı Raspberry Pi'a bağlı toprak nem ölçüm sensörlerinden alınan verilerin anlık olarak arayüzde görüntülenmesi ve gaussian regression algoritması ile bir nem tahmin haritasının oluşturulması ve zaman içindeki nem değişimini gözlemlemektir. Mevcut kodda arayüzün üç ayrı penceresi bulunuyor, birisi anlık olarak sensörlerin ölçümünü gösterir, diğeri her 15 dakikada güncellenen nem tahmin haritasını gösterir ve logs sayfası ise saatte bir alınan ölçümü gösterir.

Web arayüzü ve API NextJS ile yazıldı, çalıştırmak için MongoDB ve MinIO gereklidir. NextJS tarafı API'a gönderilen isteklere göre sensörleri MongoDB'ye, harita bilgisini MinIO'ya yazıp bunu arayüzde sergilemekle yükümlüdür. Sensör verisini okumak ve haritanın jpeg formatında resmini oluşturma görevini üstlenmez, example.py'de bunun örneği vardır.

Örnek bir görüntü, sağdaki tahmin haritası enlem ve boylam olarak arazide her bir noktadaki tahmini toprak nemini göstermektedir.
![image](https://github.com/user-attachments/assets/67e1eb42-c793-414f-8723-3669a328bdb3)
