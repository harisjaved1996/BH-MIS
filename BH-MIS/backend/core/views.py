from rest_framework.decorators import api_view
from rest_framework.response import Response

from .sessions import session_choices


@api_view(["GET"])
def sessions_view(request):
    return Response({"sessions": session_choices()})
