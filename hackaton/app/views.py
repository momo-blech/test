from django.shortcuts import render, redirect, get_object_or_404
from langchain_community.llms import Ollama
from django.urls import reverse
#from pymongo import MongoClient
from bson import ObjectId
from django.views.decorators.csrf import csrf_exempt
import io
import os
#import google.generativeai as genai
from PIL import Image
from base64 import b64decode
from django.http import JsonResponse
#import google.generativeai as genai
from sympy import sympify
from django.http import HttpResponse
import random
from django.contrib.auth import authenticate, login as django_login
from django.contrib import messages
from django.contrib.auth.models import User
import subprocess

'''
MONGO_HOST = 'localhost'
MONGO_PORT = 27017

MONGO_COLLECTION_USER = 'jeu'
client = MongoClient(MONGO_HOST, MONGO_PORT)
db1 = client['joueur']
collection_user1 = db1['jeu']
'''

def test(request):
    return render(request, 'website/test.html')
def map(request): 
    return render(request, 'website/map.html')

def techniques_apprentissage(request):
    return render(request, 'website/techniques_apprentissage.html')

def game3d(request): 
    return render(request, 'website/game3d.html')
def dashboard(request):
    # Vérifiez si l'utilisateur est connecté en vérifiant la session
    if 'user_email' in request.session:
        email = request.session['user_email']
        # Vous pouvez rechercher les informations utilisateur dans la base de données en utilisant l'email
        user = collection_user1.find_one({'email': email})
        
        # Si l'utilisateur est trouvé, affichez les informations du tableau de bord
        if user:
            return render(request, 'website/dashboard.html', {'user': user})
    else:
        # Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
        messages.error(request, "Vous devez vous connecter pour accéder à votre tableau de bord.")
        return redirect('login')

def profile(request):
    user = None

    # Vérifier si l'utilisateur est connecté
    if 'user_id' in request.session:
        user_id = request.session['user_id']
        user = collection_user1.find_one({'_id': ObjectId(user_id)})

    if user:
        return render(request, 'website/dashboard.html', {'user': user})
    else:
        return redirect('login')
    
def login(request):
    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['password']

        # Rechercher l'utilisateur dans la base MongoDB par email
        user = collection_user1.find_one({'email': email})

        if user and user['password'] == password:
            # Stocker l'utilisateur dans la session pour marquer qu'il est connecté
            request.session['user_email'] = user['email']
            return redirect('page_accueil')  # Redirige vers la page d'accueil après la connexion
        else:
            messages.error(request, "Email ou mot de passe incorrect.")

    return render(request, 'website/login.html')
# Générer une opération mathématique en fonction du niveau
def generer_operation(niveau):
    if niveau < 3:
        # Niveau 1-3 : Addition simple
        nombre1 = random.randint(1, 10)
        nombre2 = random.randint(1, 10)
        operation = f"{nombre1} + {nombre2}"
        resultat = nombre1 + nombre2
    elif 3 <= niveau < 6:
        # Niveau 4-6 : Soustraction simple
        nombre1 = random.randint(10, 20)
        nombre2 = random.randint(1, 10)
        operation = f"{nombre1} - {nombre2}"
        resultat = nombre1 - nombre2
    elif 6 <= niveau < 8:
        # Niveau 7-8 : Multiplication
        nombre1 = random.randint(1, 10)
        nombre2 = random.randint(1, 10)
        operation = f"{nombre1} * {nombre2}"
        resultat = nombre1 * nombre2
    else:
        # Niveau 9-10 : Division avec résultat entier
        nombre1 = random.randint(10, 100)
        nombre2 = random.randint(1, 10)
        operation = f"{nombre1} / {nombre2}"
        resultat = nombre1 // nombre2  # Division entière
    return operation, resultat

def game1(request):
    # Récupérer l'email de l'utilisateur à partir de la session
    email = request.session.get('email')

    if not email:
        return HttpResponse("Aucun email trouvé dans la session")

    # Récupérer les informations de l'utilisateur dans MongoDB
    user = collection_user1.find_one({'email': email})

    if not user:
        return HttpResponse("Utilisateur non trouvé")

    niveau = user['niveau']

    if request.method == 'POST':
        try:
            reponse_utilisateur = int(request.POST['reponse'])  # S'assurer que la réponse est bien un entier
        except ValueError:
            return HttpResponse("Veuillez entrer un nombre valide.")

        # Récupérer l'opération et le résultat attendus depuis la session
        resultat_attendu = request.session.get('resultat_attendu')
        operation = request.session.get('operation')

        if reponse_utilisateur == resultat_attendu:
            # L'utilisateur a réussi le niveau, on augmente son niveau
            collection_user1.update_one(
                {'email': email},
                {'$inc': {'niveau': 1}}  # Incrémenter le niveau
            )
            # Effacer les données de la session pour la prochaine opération
            del request.session['operation']
            del request.session['resultat_attendu']
            # Rediriger vers le même jeu, qui générera un nouveau niveau
            return redirect('game1')
        else:
            # Afficher les résultats pour déboguer
            return HttpResponse(f"Désolé, réponse incorrecte. Résultat attendu: {resultat_attendu}, votre réponse: {reponse_utilisateur}")

    else:
        # Générer une nouvelle opération seulement si ce n'est pas une soumission POST
        operation, resultat_attendu = generer_operation(niveau)

        # Stocker l'opération et le résultat dans la session
        request.session['operation'] = operation
        request.session['resultat_attendu'] = resultat_attendu

    return render(request, 'website/game1.html', {
        'username': user['username'],
        'niveau': niveau,
        'operation': operation,
    })

def page_accueil(request):
    user = None  # Par défaut, aucun utilisateur

    # Vérifier si l'utilisateur est connecté en vérifiant la session
    if 'user_id' in request.session:
        user_id = request.session['user_id']
        # Rechercher l'utilisateur dans MongoDB en utilisant ObjectId
        user = collection_user1.find_one({'_id': ObjectId(user_id)})

    return render(request, 'website/page_accueil.html', {'user': user})
def missions(request):
    return render(request, 'website/missions.html')
def logout(request):
    # Déconnexion de l'utilisateur
    request.session.flush()
    return redirect('page_accueil')

def register(request):
    if request.method == 'POST':
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']

        # Sauvegarde dans MongoDB
        collection_user1.insert_one({
            'username': username,
            'email': email,
            'password': password,
            'niveau': 0  # L'utilisateur commence au niveau 0
        })

        # Stocker l'email dans la session
        request.session['email'] = email
        
        return redirect('page_accueil')  # Rediriger vers la vue du jeu

    return render(request, 'website/register.html')

def generate_equation(request):
    # Configuration de l'API
    os.environ['API_KEY'] = 'AIzaSyASXoWwUt-fS5HeJsut1SN3djlVis8aUug'  # Remplacez par votre clé API
    genai.configure(api_key=os.environ["API_KEY"])

    # Définir le modèle
    model = genai.GenerativeModel('gemini-1.5-flash')

    # Prompt pour générer une équation simple
    prompt = "Generate a random simple math equation to solve"
    
    # Génération de contenu via le modèle
    response = model.generate_content([prompt])
    
    # Récupérer le texte généré (l'équation)
    equation = response.text  # Assurez-vous que cette structure est correcte selon votre version

    return JsonResponse({'equation': equation})

    if request.method == 'POST':
        # Récupérer l'image en base64 depuis le frontend
        image_data = request.POST.get('image')
        if image_data:
            try:
                # Décoder l'image base64 en binaire
                image_data = image_data.split(",")[1]  # Enlever le préfixe 'data:image/png;base64,'
                image_bytes = b64decode(image_data)

                # Charger l'image dans PIL pour l'analyse
                image = Image.open(io.BytesIO(image_bytes))

                # Analyser l'image avec Google Generative AI
                prompt = "Je te donne une image à analyser. Peux-tu résoudre les équations représentées dessus ?"
                model = genai.GenerativeModel('gemini-1.5-flash')

                # Envoyer l'image et le prompt à l'API
                response = model.generate_content([prompt], image=image_bytes)

                # Retourner la réponse de l'IA au format JSON
                if response:
                    return JsonResponse({'result': response.text})
                else:
                    return JsonResponse({'error': 'Aucune réponse de l\'IA.'})
            except Exception as e:
                return JsonResponse({'error': str(e)})

        return JsonResponse({'error': 'Aucune donnée d\'image reçue.'})

    # Si ce n'est pas une requête POST, rendre le template HTML
    return render(request, 'website/dessin.html')



