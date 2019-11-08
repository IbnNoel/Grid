FROM node:10-alpine
WORKDIR /opt/
COPY package.json package-lock.json /opt/
RUN cd /opt/ && ls -l
RUN npm install
ENV PATH /opt/node_modules/.bin:$PATH
RUN cd /opt/node_modules && ls -l
COPY . /opt/
COPY . .
#RUN wget -c https://wubsdev.s3.amazonaws.com/twistlock/twistlock_defender_rasp.tar.gz 


#ENTRYPOINT [ "node", "./server/server.js" ]

# Twistlock RASP Defender
#RUN tar -zxf twistlock_defender_rasp.tar.gz 

#ENV DEFENDER_TYPE="rasp"
#ENV RASP_APP_ID="test-id"
#ENV WS_ADDRESS="wss://twistlock.sharedservices.awswuintranet.net:8084"
#ENV DATA_FOLDER="/tmp"
#ENV INSTALL_BUNDLE="eyJzZWNyZXRzIjp7ImNhLnBlbSI6Ii0tLS0tQkVHSU4gQ0VSVElGSUNBVEUtLS0tLVxuTUlJQy9qQ0NBZWFnQXdJQkFnSVJBTzFSMndJZnZiK01adW1JNkZEWXVuTXdEUVlKS29aSWh2Y05BUUVMQlFBd1xuS0RFU01CQUdBMVVFQ2hNSlZIZHBjM1JzYjJOck1SSXdFQVlEVlFRREV3bFVkMmx6ZEd4dlkyc3dIaGNOTVRrd1xuTmpJeE1qRXhOakF3V2hjTk1qSXdOakl3TWpFeE5qQXdXakFvTVJJd0VBWURWUVFLRXdsVWQybHpkR3h2WTJzeFxuRWpBUUJnTlZCQU1UQ1ZSM2FYTjBiRzlqYXpDQ0FTSXdEUVlKS29aSWh2Y05BUUVCQlFBRGdnRVBBRENDQVFvQ1xuZ2dFQkFOT1I3QXZNUHNiQUE4eG1VV1QyRVFTVWlPcHVYNUpudE40Z1JpWVYwZU5VWXNyVzVISDBwSkNEUWxGNVxuc0Z6eVZ4Sjd4T2xOVXRUTmJ1MmkzZm1mUmxjc3JhSkNZL2FZSVBrMjhZSHBFQmVJWGY5ZFh2WHNhYk1FZ090VVxuVmRZZGcrVm5XRXg2a0JMWUR0TWtDdk5CakNGOFdjYW1OS0lLSllmNXIyNU96R0RyelhHbTZRRVFSVDJmMHNzdlxubXR4SmZRbC91cDZZZ1JJbzBSeEwreThydzhwSy9wSUZBNHh2WXRCQnVoZjAxWXc0Nnl4TjZNamtnOE82b0Nsc1xuVUNyNFhNTnQrRUZVem9QSFdWek9nUEFTOHphaTRVMFhjN24yNXNOWHFHRXVTR0VlQWQycVE1dko2Yi9ZcmRpK1xuZ2xUTjR3KzNjZU94RnN5QnpRajVNa0FZZWNVQ0F3RUFBYU1qTUNFd0RnWURWUjBQQVFIL0JBUURBZ0tzTUE4R1xuQTFVZEV3RUIvd1FGTUFNQkFmOHdEUVlKS29aSWh2Y05BUUVMQlFBRGdnRUJBQ2xYRzlEcHVsM0kzQTFTWmV1TFxuaC9QcExvQ29Hd3V3UUdkZDMrSjF5NW1PYWt5QnRtalpaMXpXY3lwRXdJNlVyMDdVTzRyaVBqeWlhQ1J6S1F0elxuQmY3VWtISTJEWjF1OHg2ZlVIaUdwMVRLamFUVW1FWnk2K2szdE45emNOU3FyaHE3VUIvRk1Ya1JPblJ6NG9DbFxuOFFKMVlOUW1NZ2svUGN5ZUh3WGpVYVNKSzVtV1RQSm1mcGN3MmZWZCs1ejZDZEJ6b1FDQXVnVUxmYUVtOUkxMFxuNXJJdjdsZTRuWEFoVnVkdkxDWDJPMHQrak1GOGorMkdTR2xxNTVFNVJLak5oOU5JWGRpc2FyaWIzWVBKdzk2YVxuQTU0ckV5Mkw4L3NJbFVOck5VaS93UE9FNEFOdWRYZkRZMjd6U0Nzc0ZpNkVRdWxCL2dKZjgwcm9ORjVWeVk5dVxuckxBPVxuLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLVxuIiwiY2xpZW50LWNlcnQucGVtIjoiLS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tXG5NSUlER3pDQ0FnT2dBd0lCQWdJUkFKNk5wMUExeVEvWXE5a28veFI2ZzBBd0RRWUpLb1pJaHZjTkFRRUxCUUF3XG5LREVTTUJBR0ExVUVDaE1KVkhkcGMzUnNiMk5yTVJJd0VBWURWUVFERXdsVWQybHpkR3h2WTJzd0hoY05NVGt3XG5Oakl4TWpFME16QXdXaGNOTWpJd05qSXdNakUwTXpBd1dqQW9NUkl3RUFZRFZRUUtFd2xVZDJsemRHeHZZMnN4XG5FakFRQmdOVkJBTVRDV3h2WTJGc2FHOXpkRENDQVNJd0RRWUpLb1pJaHZjTkFRRUJCUUFEZ2dFUEFEQ0NBUW9DXG5nZ0VCQUsvcUo1UlA5d0dlTkdoQ05COGNuUVBxZCsvKzFYWXBlYVpubTQ3dENDMlBXU1VzbkMrODlMdC9uTTRZXG43aFA0RjFZaVVxbzVKc1NVbTFkK0t0QkVQblR5d3krMVNwcy9NcWVHTmdXQnUyTThSVWFPU0JZT2R3b0RhM1pSXG5GeUd3QUd5SGN1WEVHekV1UGE4TUZyZ2lMbWtpK04rZkdnSXYrTkttNzR0VUtrUTN4TGovK0wwS1NzT3JrdlFjXG54VUhteWV5UzdWazVEVHpyVW9tQThDeWhYZUxoVGdYSUxuQm1EWGYvTC82cVpZejlWbFUrbFZ6OHRDSDlNb3hoXG5RRHZBZXhKcTVuRUFGeTFTZ2prVDdkU0VzdDNOcERYVUNXZzVodE5pbGhoYkxBeC9jOVNBaU9mVHEyTkVZNm0xXG52NFZzK3QvdkVKZmdONHFSTWZoU016YlkycmtDQXdFQUFhTkFNRDR3RGdZRFZSMFBBUUgvQkFRREFnZUFNQk1HXG5BMVVkSlFRTU1Bb0dDQ3NHQVFVRkJ3TUNNQXdHQTFVZEV3RUIvd1FDTUFBd0NRWUZLZ1FCQWdjRUFEQU5CZ2txXG5oa2lHOXcwQkFRc0ZBQU9DQVFFQVp5TlJYSWs0K1lwTXJsbTBKZVBGQThMd2pLQWhzNytBRmZhVWdqRjBRakV0XG5QOHRpR1l2dWhXSyt3RmtOVXU0U09kY1VPYUd4VDhCMmRWaGZLV1RzY1dkdFJSUWdjVVFmaXJ4MkJHZkwzZjR3XG4vVkVRbjNVb0xaWDhOeEF5dG51R3Vsd1MzY1lTMmhHMDdRWXJqVkdSSkhUZmFWQVpyT3UvUVVBeE5iY1RUK1c5XG5sa090ZUV2dFVVYTNxVjFqYTRFMzFCVWQzN2FVRjRIMnRzeUloaXBVWFM4TVg1TzRVWGN3TEVDbzlGSG1MbmdiXG5COVhuNzNpdnFjQlNoSWUraWVhNGVDZnlLVGliNDE4ZVRRdU9LTlJtN1owVmVML3BYWHpLTVVWeitoY0Uzb3g4XG5kTlIyZlRiNFhjQmJkTlZxeVpDUVlPVWxEWXQweERPVkVlSnNlTjREVGc9PVxuLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLVxuIiwiY2xpZW50LWtleS5wZW0iOiItLS0tLUJFR0lOIFJTQSBQUklWQVRFIEtFWS0tLS0tXG5NSUlFcEFJQkFBS0NBUUVBcitvbmxFLzNBWjQwYUVJMEh4eWRBK3AzNy83VmRpbDVwbWVianUwSUxZOVpKU3ljXG5MN3owdTMrY3poanVFL2dYVmlKU3Fqa214SlNiVjM0cTBFUStkUExETDdWS216OHlwNFkyQllHN1l6eEZSbzVJXG5GZzUzQ2dOcmRsRVhJYkFBYklkeTVjUWJNUzQ5cnd3V3VDSXVhU0w0MzU4YUFpLzQwcWJ2aTFRcVJEZkV1UC80XG52UXBLdzZ1UzlCekZRZWJKN0pMdFdUa05QT3RTaVlEd0xLRmQ0dUZPQmNndWNHWU5kLzh2L3FwbGpQMVdWVDZWXG5YUHkwSWYweWpHRkFPOEI3RW1ybWNRQVhMVktDT1JQdDFJU3kzYzJrTmRRSmFEbUcwMktXR0Zzc0RIOXoxSUNJXG41OU9yWTBSanFiVy9oV3o2Mys4UWwrQTNpcEV4K0ZJek50amF1UUlEQVFBQkFvSUJBUUNDVUE3cHl5TExUQXErXG5nT3hqYjZyUXo4dnhPUEdnQ3JGWEY4RWdhMjUzY1kwMEFJdml3VEw2QWxxQ1FlMTdWWGpVRWJEeThFdExyRm8yXG53ZnV0TkNDZ09ZVmx2Z0o2WnFKN2Z1eGR2L0MwWGwxakd0dERtNHVMRzJWcnpENDZja3FlR3VoK1ZIdGdQMFRxXG5leVlKV1NqUU1WdnpLOFQwZ2R6dEQwUzhEYWtSeHBPd1IzUnR5TUhTMVlZWEZmTzlRelBJUjNpQUJwT0hLMURxXG5BZmtaamZHSm0rOEFTOTI5VnBQb3IyMnpGMHVpQmJMLzM4WHRuUytNZHJkZ0R5YUV2ZmxPMHNCVG92c2w3dVdBXG51R3l3ODEzZG5WdGpOM1ZtY1dJLzJseGViRTAwRjd4SjVNM1BrTXZOQStJcTlpM0UwV3RiNUhwWmtnMTBuc2pkXG5tVW1DZkJOQkFvR0JBTThrMHEvRlUvcERmUEV5Tk51K0Z1by9mQTRBWmdBbWhnWjZBMEV3ZFd0N01FVnJuTUZaXG5MU25ySTB1ZEhIS0JweHJDWUF5T0VKQmVNanBsSUo0L0dWUGxxMHFXNWdRdmo0bzR3bTZMSzd2Wno0aGdiUTUwXG5sTzFaTWYxM0hCT2ZUaDRscUkrR3UydlZJVDhKYlBFQ3VhMnhBSzZ0OGp5MXpIc0RHZU5TUUh2ZEFvR0JBTmxuXG52VTBTK29JM3k4bVRzU1FkTTlOaHhabE5KTjhUVW9EVHVIa2VBbFlNYXBvNVRERjBybmtmQ0ozbHpLU2k2L3Y0XG5zSHJiMjFnTFk5bE5LZHcrdTdVYUttZWRRT2wwaXo3S0wweDlDNFQyajQ2NHVQYXp2VENUNEpkUmFHQWVNajFhXG56aVdHSS9xaTZrTEYvdnFlek1mRUkvemtFRkxXRGNWM3I5NkZsZ3FOQW9HQWNBMi9XdzRueTIzT25MdElGTWJUXG5wb3dKRTVucms1RkRWeVdSdFNYOW50TFkzZlRFcTJNT0oycm5nUFBRZTdEZk1INk5icjA3QUoyMEZocTJkbVF6XG4wMHFlU284dWhuMGo3T1dmYUNVbzEwbVFGbm56QktyVUZVRDI1ZUlVOGhodkxhZTVjMHF6QURZZThmYXJWQVRoXG5aTEFuYWxiMmZ4anBNSElSQXdOdmxwRUNnWUVBeWFEUnl5S1gzSjg4ekNYQ3V4aXVVUlF6ZTlzMUlBSyttS1pEXG5SMmtTaDVXYVpKQlJYdWkxUzdZQmV0ZCtkUTU0eUVhNy9pWGJod3VCUGk2M2JRRnRleWZhUGlCMDdFOWZPUXV3XG4xRUtBcFg4Nll3WmszTUNUN1BLbzhBM2JQSkdrekl4ajloOHpUU2M5RmxLbENQQ3dRWEZpWXc5dEtEWkhyV1UwXG5ZYThKR1owQ2dZQVRuMG9yZDZkVDRhNEtyTXMvVG1ZbWtaZFVIM21BekoxNGl0WW1aSi9aazQrbU50VlJFa1JIXG5lbEs5OEczNHZvQjN2a3FMQVUyUS92d2JKNnNFalhmM1NVYlM1OFFVdVJ1SUtaemJWV1o2VWVIMndWTXdMbTNIXG41aHp6UVNPVFlNT0dhMHVTc25EUDRVbjlGZHFMZjlERHZUZ3A1YkpQSVpXUVl0blBDUUhUUlE9PVxuLS0tLS1FTkQgUlNBIFBSSVZBVEUgS0VZLS0tLS1cbiJ9LCJnbG9iYWxQcm94eU9wdCI6eyJodHRwUHJveHkiOiIiLCJub1Byb3h5IjoiIiwiY2EiOiIiLCJ1c2VyIjoiIiwicGFzc3dvcmQiOnsiZW5jcnlwdGVkIjoiIn19fQ=="
#Replace with current enty point
EXPOSE 4200
RUN ng build --prod
#ENTRYPOINT ["/tmp/defender", "rasp", "node", "./server/server.js"]
ENTRYPOINT ["node", "./server/server.js"]

