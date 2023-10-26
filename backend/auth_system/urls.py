from django.urls import path, include, re_path
from django.views.generic import TemplateView

urlpatterns = [
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('auth/', include('djoser.social.urls')),
]
urlpatterns += [
    re_path(r'^activate/(?P<uid>[\w-]+)/(?P<token>[\w-]+)/$', TemplateView.as_view(template_name='verify.html'), name='activate'),   
]
urlpatterns += [re_path(r'^password/reset/confirm/(?P<uid>[\w-]+)/(?P<token>[\w-]+)/$', TemplateView.as_view(template_name='newpwd.html'), name='activate'),
]

