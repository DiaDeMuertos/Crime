FROM ubuntu:16.04

WORKDIR /base

RUN apt-get update
RUN apt-get install -y wget
RUN apt-get install -y unzip

RUN wget --no-check-certificate https://qtzm1q.bl.files.1drv.com/y4mfhjjaDVn0yYFTauaSILcQUwIRr1HH1vqK91KdBuQw-D_46L5NLoOsrvwrsB7WlmGsdelh1aIiu01BKAPMO4CTtREMvCVDDXC5LSnBN0F-XIOFTqd3L4lfD5HDqMIMEpKlSkFk-H72bVmaJ8Wq6-yUC2INaQZo2RdshLGmvcyRj5rICfqWmSXL-VlVCyat9BS/shape-files.zip
RUN wget --no-check-certificate https://p2clmw.bl.files.1drv.com/y4mJD0_Goikmt4b_zHIOWBItbCPKWbRxh6XgVexVDN0Kc3O4r8lilPhoGar_fZv-KH8k8FMiLq488uVMd1Keo8QGF_sG5Ay6RNaAZk8RsQoNZjMZCrSE2vle7W3cboIDDBXbiEn4MAnoxYlYbhQhBqz1RoF5dDat5QfSiCUuWWZ3XhHQiLvwgoSI3kcxVQtrbEG/csv-files.zip

RUN unzip shape-files.zip
RUN unzip csv-files.zip
RUN rm *.zip

CMD ["/bin/bash"]